//db.ts

import { Pool } from 'pg';
import config from './index';


const pool = new Pool({
    connectionString: `${config.connectionString}`,
});


const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(200) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(50) DEFAULT 'customer' NOT NULL CHECK (role IN ('admin', 'customer')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           
    )`);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price >= 0),
    availability_status VARCHAR(20) DEFAULT 'available' NOT NULL 
       CHECK (availability_status IN ('available', 'booked', 'returned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);


    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL REFERENCES users(id),
            vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
            status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
            CHECK (rent_end_date >= rent_start_date),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Tables are created or already exist.');
}


export { pool, initDb };