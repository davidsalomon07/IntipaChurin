const bcrypt = require('bcrypt');
const pool = require('./db');

async function generarAdmins() {
    try {
        console.log("⏳ Buscando rol de Administrador...");
        const roleQuery = await pool.query("SELECT id FROM roles WHERE name = 'ADMIN'");

        if (roleQuery.rows.length === 0) {
            console.log("❌ Error: El rol ADMIN no existe en tu tabla 'roles'.");
            process.exit(1);
        }
        const adminRoleId = roleQuery.rows[0].id;

        // === AQUÍ COLOCAS LOS CORREOS REALES ===
        const admins = [
            {
                email: '', // <-- CAMBIA ESTO POR SU CORREO REAL
                password: '',           // <-- Puedes cambiar la contraseña inicial
                first_name: '',
                last_name: ''                        // <-- Cambia esto por su apellido
            },
            {
                email: 'ldsalomon@puce.edu.ec',        // <-- CAMBIA ESTO POR TU CORREO REAL
                password: 'CR7elgoat.',               // <-- Puedes cambiar la contraseña inicial
                first_name: 'David',
                last_name: 'Salomón'
            }
        ];

        console.log("=========================================");
        console.log("  INICIALIZANDO CUENTAS DE ADMINISTRADOR ");
        console.log("=========================================\n");

        for (const admin of admins) {
            console.log(`🔍 Verificando cuenta para: ${admin.first_name}...`);

            const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [admin.email]);

            if (userCheck.rows.length > 0) {
                console.log(`⚠️ El administrador ${admin.first_name} (${admin.email}) ya existe.\n`);
                continue; // Si ya existe, salta al siguiente para no duplicar
            }

            console.log(`🔒 Encriptando contraseña de ${admin.first_name}...`);
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(admin.password, salt);

            console.log(`💾 Guardando a ${admin.first_name} en PostgreSQL...`);
            await pool.query(
                'INSERT INTO users (role_id, email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5)',
                [adminRoleId, admin.email, password_hash, admin.first_name, admin.last_name]
            );

            console.log(`✅ ¡Administrador ${admin.first_name} creado exitosamente!`);
            console.log(`   📧 Email: ${admin.email}`);
            console.log(`   🔑 Contraseña: ${admin.password}\n`);
        }

        console.log("🚀 Proceso finalizado. El sistema está blindado.");

    } catch (error) {
        console.error("❌ Ocurrió un error:", error.message);
    } finally {
        process.exit(0);
    }
}

generarAdmins();