const connectDB = require("./database");

async function testConnection() {
    const db = await connectDB(':memory:');

    await db.run('INSERT INTO users (name) VALUES (?)', [
        'Test'
    ])

    const users = await db.all('SELECT * FROM users');

    console.log('Users:', users);

    db.close()
}

testConnection()