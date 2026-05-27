const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
const jwt = require('jsonwebtoken'); // <-- NUEVO: Para generar el token de sesión

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
    // 1. Recibimos los datos actualizados que envía el frontend (Register.jsx)
    const { first_name, last_name, email, password } = req.body;

    // 2. Verificamos si el correo ya existe en la base de datos
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Este correo electrónico ya está registrado." });
    }

    // 3. Buscamos automáticamente el ID del rol 'CLIENTE'
    const roleQuery = await pool.query("SELECT id FROM roles WHERE name = 'CLIENTE'");
    if (roleQuery.rows.length === 0) {
      return res.status(500).json({ error: "Error crítico: El rol CLIENTE no existe en la BD." });
    }
    const clienteRoleId = roleQuery.rows[0].id;

    // 4. Encriptamos la contraseña (nadie, ni el admin, debe poder verla)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 5. Guardamos al usuario en la tabla 'users' con nombre y apellido
    const newUser = await pool.query(
      'INSERT INTO users (role_id, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, created_at',
      [clienteRoleId, email, password_hash, first_name, last_name]
    );

    // 6. Le respondemos al Frontend que fue un éxito
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

    // 1. Verificamos si el usuario existe en la base de datos
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const user = userQuery.rows[0];

    // 2. Comparamos la contraseña enviada con la contraseña encriptada (Hash)
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // 3. Creamos el Token de sesión (Firma digital)
    // En producción, la palabra 'secreto_intipa_2026' debe ir en tu archivo .env
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      'secreto_intipa_2026',
      { expiresIn: '24h' } // El token caduca en 1 día
    );

    // 4. Respondemos con éxito, enviando el token y los datos básicos
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
    // 1. Verificamos que el usuario tenga su llave de acceso (Token)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No autorizado. Falta el token." });
    }

    const token = authHeader.split(' ')[1]; // Separamos la palabra "Bearer" del token real

    // 2. Desencriptamos el token para saber quién es (sacamos su id)
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    // 3. Recibimos los nuevos datos que mandó el frontend, incluyendo el teléfono
    const { first_name, last_name, email, phone } = req.body;

    // 4. Verificamos que el nuevo correo no esté siendo usado por OTRA persona
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Este correo ya está en uso por otra cuenta." });
    }

    // 5. Actualizamos la base de datos en PostgreSQL
    const updateQuery = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5 RETURNING id, first_name, last_name, email, phone, role_id',
      [first_name, last_name, email, phone, userId]
    );

    // 6. Devolvemos los datos actualizados
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
    // 1. Verificamos la identidad del usuario (Token)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    // 2. Recibimos los datos de la nueva dirección
    const { title, street_address, city, postal_code, phone_number } = req.body;

    // 3. Guardamos la dirección en la base de datos
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
    // 1. Verificamos la identidad del usuario
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');
    const userId = decoded.id;

    // 2. Buscamos solo las direcciones que le pertenecen a este usuario
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

    const addressId = req.params.id; // El ID de la dirección que viene en la URL
    const { title, street_address, city, postal_code, phone_number } = req.body;

    // Actualizamos validando que la dirección le pertenezca a este usuario (seguridad extra)
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

    // Eliminamos asegurándonos de que sea SU dirección
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
    // Hacemos un JOIN con la tabla categories para enviarle al Frontend 
    // el nombre real de la categoría ('Hoodies', 'Camisetas') en lugar del ID numérico
    const result = await pool.query(`
      SELECT 
        p.id, 
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

    // Devolvemos el array de productos directamente
    res.json(result.rows);

  } catch (error) {
    console.error("❌ Error al cargar el catálogo de productos:", error.message);
    res.status(500).json({ error: "Hubo un problema al cargar los productos." });
  }
});

// ==========================================
// 🚨 AQUÍ ESTÁ EL MIDDLEWARE QUE FALTABA 🚨
// ==========================================
const verificarAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado. Falta el token." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto_intipa_2026');

    // Asumimos que ADMIN es el id 1 en tu tabla 'roles'
    if (decoded.role_id !== 1) {
      return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
    }

    req.user = decoded;
    next(); // Si es Admin, lo dejamos pasar a la ruta
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// ==========================================
// 9. ADMIN - CREATE: Agregar un nuevo producto
// ==========================================
app.post('/api/admin/products', verificarAdmin, async (req, res) => {
  try {
    const { category_id, name, description, price, stock_quantity, image_url, is_active } = req.body;

    const newProduct = await pool.query(
      `INSERT INTO products (category_id, name, description, price, stock_quantity, image_url, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [category_id, name, description, price, stock_quantity, image_url, is_active]
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
// 10. ADMIN - UPDATE: Editar un producto existente
// ==========================================
app.put('/api/admin/products/:id', verificarAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const { category_id, name, description, price, stock_quantity, image_url, is_active } = req.body;

    const updateQuery = await pool.query(
      `UPDATE products 
       SET category_id = $1, name = $2, description = $3, price = $4, stock_quantity = $5, image_url = $6, is_active = $7 
       WHERE id = $8 RETURNING *`,
      [category_id, name, description, price, stock_quantity, image_url, is_active, productId]
    );

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
// 11. ADMIN - DELETE: Eliminar un producto
// ==========================================
app.delete('/api/admin/products/:id', verificarAdmin, async (req, res) => {
  try {
    const productId = req.params.id;

    // En e-commerce a veces es mejor un "Soft Delete" (is_active = false), 
    // pero aquí hacemos el DELETE real que pediste para limpiar el inventario.
    const deleteQuery = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [productId]
    );

    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    res.json({ message: "Producto eliminado definitivamente del inventario." });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error.message);
    res.status(500).json({ error: "Error al intentar eliminar el producto." });
  }
});

// ==========================================
// 12. READ: Obtener categorías (Público, necesario para el form del Admin)
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
    // Solo traemos a los que tienen rol de CLIENTE (no a los admins)
    const users = await pool.query(
      "SELECT id, first_name, last_name, email, created_at FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CLIENTE') ORDER BY created_at DESC"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar usuarios." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});