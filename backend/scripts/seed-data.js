const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando inserción de datos de prueba...');
        
        // Crear usuarios de prueba
        const users = [
            {
                user_name: 'Juan Pérez',
                email: 'juan@example.com',
                phone: '+1234567890',
                passwords: 'password123',
                rol: 'user',
                objetive: 'Aprender desarrollo web completo',
                preferred_language: 'es'
            },
            {
                user_name: 'María García',
                email: 'maria@example.com',
                phone: '+1234567891',
                passwords: 'password123',
                rol: 'user',
                objetive: 'Mejorar mis habilidades de diseño UX',
                preferred_language: 'es'
            },
            {
                user_name: 'Admin Vmind',
                email: 'admin@vmind.com',
                phone: '+1234567892',
                passwords: 'admin123',
                rol: 'admin',
                objetive: 'Gestionar la plataforma de aprendizaje',
                preferred_language: 'es'
            }
        ];

        console.log('👤 Creando usuarios de prueba...');
        const createdUsers = [];
        
        for (const userData of users) {
            const userId = uuidv4();
            const hashedPassword = await bcrypt.hash(userData.passwords, 10);
            
            const query = `
                INSERT INTO users (user_id, user_name, email, phone, passwords, rol, objetive, preferred_language)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                userId,
                userData.user_name,
                userData.email,
                userData.phone,
                hashedPassword,
                userData.rol,
                userData.objetive,
                userData.preferred_language
            ];

            await pool.execute(query, values);
            createdUsers.push({ ...userData, user_id: userId });
            console.log(`   ✅ Usuario creado: ${userData.user_name} (${userData.email})`);
        }

        // Crear roadmaps de prueba
        const roadmaps = [
            {
                title: 'Desarrollo Web Frontend',
                roadmap_description: 'Aprende HTML, CSS y JavaScript desde cero hasta crear aplicaciones web modernas',
                topic: 'Desarrollo Web',
                difficulty: 'beginner',
                estimated_time: 120,
                user_id: createdUsers[0].user_id
            },
            {
                title: 'Diseño UX/UI Avanzado',
                roadmap_description: 'Domina los principios de diseño de experiencia de usuario y interfaces',
                topic: 'Diseño',
                difficulty: 'intermediate',
                estimated_time: 90,
                user_id: createdUsers[1].user_id
            },
            {
                title: 'Python para Data Science',
                roadmap_description: 'Aprende Python y sus librerías para análisis de datos y machine learning',
                topic: 'Data Science',
                difficulty: 'advanced',
                estimated_time: 150,
                user_id: createdUsers[0].user_id
            }
        ];

        console.log('\n🗺️ Creando roadmaps de prueba...');
        const createdRoadmaps = [];
        
        for (const roadmapData of roadmaps) {
            const query = `
                INSERT INTO roadmaps (title, roadmap_description, topic, difficulty, estimated_time, user_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                roadmapData.title,
                roadmapData.roadmap_description,
                roadmapData.topic,
                roadmapData.difficulty,
                roadmapData.estimated_time,
                roadmapData.user_id
            ];

            const [result] = await pool.execute(query, values);
            createdRoadmaps.push({ ...roadmapData, roadmap_id: result.insertId });
            console.log(`   ✅ Roadmap creado: ${roadmapData.title}`);
        }

        // Crear niveles para los roadmaps
        console.log('\n📚 Creando niveles para los roadmaps...');
        const levels = [
            // Niveles para Desarrollo Web Frontend
            {
                roadmap_id: createdRoadmaps[0].roadmap_id,
                title: 'Fundamentos HTML',
                description: 'Aprende la estructura básica de HTML y sus elementos principales',
                order_number: 1,
                xp_reward: 100
            },
            {
                roadmap_id: createdRoadmaps[0].roadmap_id,
                title: 'Estilos con CSS',
                description: 'Domina CSS para crear diseños atractivos y responsivos',
                order_number: 2,
                xp_reward: 150
            },
            {
                roadmap_id: createdRoadmaps[0].roadmap_id,
                title: 'JavaScript Básico',
                description: 'Introducción a JavaScript y programación web interactiva',
                order_number: 3,
                xp_reward: 200
            },
            // Niveles para Diseño UX/UI
            {
                roadmap_id: createdRoadmaps[1].roadmap_id,
                title: 'Principios de UX',
                description: 'Fundamentos de experiencia de usuario y investigación',
                order_number: 1,
                xp_reward: 120
            },
            {
                roadmap_id: createdRoadmaps[1].roadmap_id,
                title: 'Diseño de Interfaces',
                description: 'Creación de interfaces intuitivas y atractivas',
                order_number: 2,
                xp_reward: 180
            }
        ];

        const createdLevels = [];
        for (const levelData of levels) {
            const query = `
                INSERT INTO levels (roadmap_id, title, description, order_number, xp_reward, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                levelData.roadmap_id,
                levelData.title,
                levelData.description,
                levelData.order_number,
                levelData.xp_reward,
                'unlocked'
            ];

            const [result] = await pool.execute(query, values);
            createdLevels.push({ ...levelData, level_id: result.insertId });
            console.log(`   ✅ Nivel creado: ${levelData.title}`);
        }

        // Crear tareas para los niveles
        console.log('\n✅ Creando tareas de prueba...');
        const tasks = [
            // Tareas para Fundamentos HTML
            {
                level_id: createdLevels[0].level_id,
                title: 'Crear tu primera página HTML',
                description: 'Crea una página web básica con HTML5',
                type: 'practice',
                xp_reward: 50
            },
            {
                level_id: createdLevels[0].level_id,
                title: 'Quiz: Elementos HTML',
                description: 'Pon a prueba tu conocimiento sobre elementos HTML',
                type: 'quiz',
                xp_reward: 30
            },
            // Tareas para Estilos CSS
            {
                level_id: createdLevels[1].level_id,
                title: 'Diseñar un formulario',
                description: 'Crea un formulario atractivo usando CSS',
                type: 'practice',
                xp_reward: 75
            },
            // Tareas para JavaScript Básico
            {
                level_id: createdLevels[2].level_id,
                title: 'Calculadora simple',
                description: 'Crea una calculadora funcional con JavaScript',
                type: 'project',
                xp_reward: 100
            }
        ];

        for (const taskData of tasks) {
            const query = `
                INSERT INTO tasks (level_id, title, description, type, xp_reward, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                taskData.level_id,
                taskData.title,
                taskData.description,
                taskData.type,
                taskData.xp_reward,
                'pending'
            ];

            await pool.execute(query, values);
            console.log(`   ✅ Tarea creada: ${taskData.title}`);
        }

        // Crear algunos intereses
        console.log('\n🎯 Creando intereses de prueba...');
        const interests = [
            'JavaScript', 'Python', 'UI/UX Design', 'Database', 'Web Development',
            'Mobile Apps', 'Artificial Intelligence', 'Data Science', 'Graphic Design', 'Digital Marketing'
        ];

        for (const interestName of interests) {
            const query = 'INSERT INTO interests (name) VALUES (?)';
            await pool.execute(query, [interestName]);
        }
        console.log(`   ✅ ${interests.length} intereses creados`);

        // Crear algunos logros
        console.log('\n🏆 Creando logros de prueba...');
        const triumphs = [
            {
                title: 'Primer Paso',
                description: 'Completaste tu primera tarea',
                icon: '🎯',
                xp_required: 50,
                type_triumph: 'progress'
            },
            {
                title: 'Constructor',
                description: 'Completaste 5 proyectos',
                icon: '🏗️',
                xp_required: 500,
                type_triumph: 'progress'
            },
            {
                title: 'Consistente',
                description: '7 días seguidos de aprendizaje',
                icon: '🔥',
                xp_required: 200,
                type_triumph: 'streak'
            }
        ];

        for (const triumphData of triumphs) {
            const query = `
                INSERT INTO triumphs (title, description, icon, xp_required, type_triumph)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const values = [
                triumphData.title,
                triumphData.description,
                triumphData.icon,
                triumphData.xp_required,
                triumphData.type_triumph
            ];

            await pool.execute(query, values);
        }
        console.log(`   ✅ ${triumphs.length} logros creados`);

        console.log('\n🎉 ¡Datos de prueba insertados exitosamente!');
        console.log('\n📋 Resumen:');
        console.log(`   - ${users.length} usuarios creados`);
        console.log(`   - ${roadmaps.length} roadmaps creados`);
        console.log(`   - ${levels.length} niveles creados`);
        console.log(`   - ${tasks.length} tareas creadas`);
        console.log(`   - ${interests.length} intereses creados`);
        console.log(`   - ${triumphs.length} logros creados`);
        
        console.log('\n🔑 Credenciales de prueba:');
        console.log('   Usuario normal: juan@example.com / password123');
        console.log('   Usuario normal: maria@example.com / password123');
        console.log('   Administrador: admin@vmind.com / admin123');

    } catch (error) {
        console.error('❌ Error al insertar datos de prueba:', error.message);
    } finally {
        process.exit(0);
    }
}

// Ejecutar el script
seedDatabase();
