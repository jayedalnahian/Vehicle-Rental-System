import { pool } from "../../config/db";
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







export const userServices = {
    createUser,
};