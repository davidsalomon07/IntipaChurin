const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Permitimos que el frontend pueda acceder a la carpeta "uploads" para ver las fotos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer: Dónde y cómo guardar las fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'producto-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Endpoint de prueba para verificar que el servidor responde
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Servidor de Intipa Churin funcionando',
    db_status: 'Conectada'
  });
});

// ==========================================
// 1. CREATE: Registro de Usuarios
// ==========================================
app.post('/api/usuarios/registro', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Este correo electrónico ya está registrado." });
    }

    const roleQuery = await pool.query("SELECT id FROM roles WHERE name = 'CLIENTE'");
    if (roleQuery.rows.length === 0) {
      return res.status(500).json({ error: "Error crítico: El rol CLIENTE no existe en la BD." });
    }
    const clienteRoleId = roleQuery.rows[0].id;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (role_id, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, created_at',
      [clienteRoleId, email, password_hash, first_name, last_name]
    );

    res.status(201).json({
      message: "¡Cuenta creada con éxito!",
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error("❌ Error en el registro:", error.message);
    res.status(500).json({ error: "Hubo un problema al crear la cuenta. Intenta más tarde." });
  }
});

// ==========================================
// 2. READ / AUTH: Inicio de Sesión (Login)
// ==========================================
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const user = userQuery.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      'secreto_intipa_2026',
      { expiresIn: '24h' }
    );

    res.json({
      message: "¡Inicio de sesión exitoso!",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id
      }
    });

  } catch (error) {
    console.error("❌ Error en el login:", error.message);
    res.status(500).json({ error: "Hubo un problema al iniciar sesión." });
  }
});

// ==========================================
// 3. UPDATE: Actualizar Perfil de Usuario
// ==========================================
app.put('/api/usuarios/perfil', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No autorizado. Falta el token." });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    const { first_name, last_name, email, phone } = req.body;

    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Este correo ya está en uso por otra cuenta." });
    }

    const updateQuery = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5 RETURNING id, first_name, last_name, email, phone, role_id',
      [first_name, last_name, email, phone, userId]
    );

    res.json({
      message: "Perfil actualizado correctamente",
      user: updateQuery.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al actualizar:", error.message);
    res.status(500).json({ error: "Error al actualizar el perfil." });
  }
});

// ==========================================
// 4. CREATE: Agregar nueva dirección
// ==========================================
app.post('/api/usuarios/direcciones', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    const { title, street_address, city, postal_code, phone_number } = req.body;

    const newAddress = await pool.query(
      'INSERT INTO addresses (user_id, title, street_address, city, postal_code, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, title, street_address, city, postal_code, phone_number]
    );

    res.status(201).json({
      message: "Dirección agregada exitosamente",
      address: newAddress.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al agregar dirección:", error.message);
    res.status(500).json({ error: "Error al guardar la dirección." });
  }
});

// ==========================================
// 5. READ: Leer/Obtener todas las direcciones
// ==========================================
app.get('/api/usuarios/direcciones', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    const addresses = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(addresses.rows);

  } catch (error) {
    console.error("❌ Error al obtener direcciones:", error.message);
    res.status(500).json({ error: "Error al cargar tus direcciones." });
  }
});

// ==========================================
// 6. UPDATE: Editar una dirección existente
// ==========================================
app.put('/api/usuarios/direcciones/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    const addressId = req.params.id;
    const { title, street_address, city, postal_code, phone_number } = req.body;

    const updateQuery = await pool.query(
      'UPDATE addresses SET title = $1, street_address = $2, city = $3, postal_code = $4, phone_number = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [title, street_address, city, postal_code, phone_number, addressId, userId]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: "Dirección no encontrada o no autorizada." });
    }

    res.json({
      message: "Dirección actualizada correctamente",
      address: updateQuery.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al actualizar dirección:", error.message);
    res.status(500).json({ error: "Error al actualizar la dirección." });
  }
});

// ==========================================
// 7. DELETE: Eliminar una dirección
// ==========================================
app.delete('/api/usuarios/direcciones/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    const addressId = req.params.id;

    const deleteQuery = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [addressId, userId]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: "Dirección no encontrada o no autorizada." });
    }

    res.json({ message: "Dirección eliminada exitosamente." });

  } catch (error) {
    console.error("❌ Error al eliminar dirección:", error.message);
    res.status(500).json({ error: "Error al intentar eliminar la dirección." });
  }
});

// ==========================================
// 8. READ: Obtener todos los productos (Catálogo público)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.category_id,   
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity, 
        p.image_url, 
        p.is_active,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `);

    // ---> AQUÍ ESTABA EL ERROR: Faltaba esta línea para enviar la respuesta a React
    res.json(result.rows);

  } catch (error) {
    console.error("❌ Error al cargar el catálogo de productos:", error.message);
    res.status(500).json({ error: "Hubo un problema al cargar los productos." });
  }
});

// ==========================================
// 8.5 READ: Obtener un solo producto por ID (Detalle y Vista Previa)
// ==========================================
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.category_id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity, 
        p.image_url, 
        p.is_active,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error al cargar el detalle del producto:", error.message);
    res.status(500).json({ error: "Hubo un problema al cargar el detalle del producto." });
  }
});

// ==========================================
// 🚨 MIDDLEWARE DE AUTENTICACIÓN ADMIN 🚨
// ==========================================
const verificarAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado. Falta el token." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');

    if (decoded.role_id !== 1) {
      return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// ==========================================
// 9. ADMIN - CREATE: Agregar un nuevo producto (Con foto)
// ==========================================
app.post('/api/admin/products', verificarAdmin, upload.single('image'), async (req, res) => {
  try {
    const { category_id, name, description, price, stock_quantity } = req.body;

    const is_active = true;
    const finalImageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    const newProduct = await pool.query(
      `INSERT INTO products (category_id, name, description, price, stock_quantity, image_url, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [category_id, name, description, price, stock_quantity, finalImageUrl, is_active]
    );

    res.status(201).json({
      message: "Producto creado exitosamente",
      product: newProduct.rows[0]
    });
  } catch (error) {
    console.error("❌ Error al crear producto:", error.message);
    res.status(500).json({ error: "Error al guardar el producto en la base de datos." });
  }
});

// ==========================================
// 10. ADMIN - UPDATE: Editar un producto existente (Con o sin foto nueva)
// ==========================================
app.put('/api/admin/products/:id', verificarAdmin, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock_quantity } = req.body;

    // 1. Buscamos la URL de la imagen actual en la BD antes de hacer cualquier cambio
    const productActualQuery = await pool.query('SELECT image_url FROM products WHERE id = $1', [productId]);
    const oldImageUrl = productActualQuery.rows[0]?.image_url;

    const newImageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    let updateQuery;
    if (newImageUrl) {
      updateQuery = await pool.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, stock_quantity = $4, image_url = $5 
         WHERE id = $6 RETURNING *`,
        [name, description, price, stock_quantity, newImageUrl, productId]
      );

      // 2. Si se subió una foto nueva y ya existía una vieja, la borramos del disco local
      if (oldImageUrl) {
        const fs = require('fs'); // Importamos fs aquí localmente por seguridad
        const filename = oldImageUrl.split('/').pop();
        const filePath = path.join(__dirname, 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } else {
      updateQuery = await pool.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, stock_quantity = $4 
         WHERE id = $5 RETURNING *`,
        [name, description, price, stock_quantity, productId]
      );
    }

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({
      message: "Producto actualizado correctamente",
      product: updateQuery.rows[0]
    });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error.message);
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
});

// ==========================================
// 10.5. ADMIN - PATCH: Activar/Desactivar Producto (Stock)
// ==========================================
app.patch('/api/admin/products/:id/toggle', verificarAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const { is_active } = req.body;

    // Actualizamos únicamente la columna is_active en la base de datos
    const updateQuery = await pool.query(
      'UPDATE products SET is_active = $1 WHERE id = $2 RETURNING *',
      [is_active, productId]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({
      message: `Producto ${is_active ? 'activado' : 'desactivado'} correctamente.`,
      product: updateQuery.rows[0]
    });
  } catch (error) {
    console.error("❌ Error al cambiar el estado del producto:", error.message);
    res.status(500).json({ error: "Error al actualizar el estado del producto." });
  }
});

// ==========================================
// 11. ADMIN - DELETE: Eliminar un producto
// ==========================================
app.delete('/api/admin/products/:id', verificarAdmin, async (req, res) => {
  try {
    const productId = req.params.id;

    // 1. Buscamos la URL de la imagen antes de eliminar el registro
    const productActualQuery = await pool.query('SELECT image_url FROM products WHERE id = $1', [productId]);
    const imageUrlToDelete = productActualQuery.rows[0]?.image_url;

    // 2. Eliminamos el registro de la base de datos
    const deleteQuery = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [productId]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // 3. Borramos la foto asociada del disco duro local
    if (imageUrlToDelete) {
      const fs = require('fs');
      const filename = imageUrlToDelete.split('/').pop();
      const filePath = path.join(__dirname, 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Producto eliminado definitivamente del inventario." });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error.message);
    res.status(500).json({ error: "Error al intentar eliminar el producto." });
  }
});

// ==========================================
// 12. READ: Obtener categorías
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al cargar categorías:", error.message);
    res.status(500).json({ error: "Error al cargar las categorías." });
  }
});

// ==========================================
// 13. ADMIN - CREATE: Agregar nueva categoría
// ==========================================
app.post('/api/admin/categories', verificarAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCat = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(newCat.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la categoría." });
  }
});

// ==========================================
// 14. ADMIN - READ: Obtener usuarios registrados
// ==========================================
app.get('/api/admin/users', verificarAdmin, async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, first_name, last_name, email, created_at FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CLIENTE') ORDER BY created_at DESC"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar usuarios." });
  }
});

// ==========================================
// 15. MÓDULO DE WISHLIST (LISTA DE DESEOS)
// ==========================================

// 15.1. POST: Agregar un producto a la Wishlist
app.post('/api/wishlist', async (req, res) => {
  try {
    // Verificamos el token igual que en tus otras rutas
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado. Falta el token." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const user_id = decoded.id;

    const { product_id } = req.body;
    if (!product_id) {
      return res.status(400).json({ error: "El ID del producto es requerido." });
    }

    const nuevoFavorito = await pool.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [user_id, product_id]
    );

    res.status(201).json({
      message: "Producto añadido a tu lista de deseos.",
      wishlist: nuevoFavorito.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: "Este producto ya está en tu lista de deseos." });
    }
    console.error("❌ Error al añadir a la wishlist:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// 15.2. GET: Obtener todos los productos de la Wishlist del usuario
app.get('/api/wishlist', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const user_id = decoded.id;

    const miLista = await pool.query(
      `SELECT p.* FROM products p
       JOIN wishlists w ON p.id = w.product_id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [user_id]
    );

    res.json(miLista.rows);
  } catch (error) {
    console.error("❌ Error al obtener la wishlist:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// 15.3. DELETE: Eliminar un producto de la Wishlist
app.delete('/api/wishlist/:productId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const user_id = decoded.id;
    const product_id = req.params.productId;

    const eliminarFavorito = await pool.query(
      'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [user_id, product_id]
    );

    if (eliminarFavorito.rowCount === 0) {
      return res.status(404).json({ error: "El producto no estaba en tu lista de deseos." });
    }

    res.json({ message: "Producto eliminado de tu lista de deseos correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar de la wishlist:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});