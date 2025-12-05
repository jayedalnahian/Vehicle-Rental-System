import { pool } from "../../config/db"
import bcrypt from "bcryptjs"

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





export const authServices = { login }