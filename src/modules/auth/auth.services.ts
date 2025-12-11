import { pool } from "../../config/db"
import bcrypt from "bcryptjs"


const createUser = async (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
}) => {

    const { name, email, password, phone, role = 'customer' } = payload;


    const hashedPassword = await bcrypt.hash(password, 10)

    const insertQuery = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
  `;

    const values = [name, email.toLowerCase(), hashedPassword, phone, role];

    const result = await pool.query(insertQuery, values);
    return result.rows[0];
}

const login = async (email: string, password: string) => {
    const result = await pool.query(
        `SELECT id, name, phone, email, password, role FROM users WHERE email = $1`, [email.toLocaleLowerCase()]
    )
    if (result.rows.length === 0) {
        throw new Error('User not found')
    }

    const user = result.rows[0]
    const isPasswordMached = await bcrypt.compare(password, user.password);
    if (!isPasswordMached) {
        throw new Error('Invalid credentials')
    }
    delete user.password
    return user;
}





export const authServices = { createUser, login }