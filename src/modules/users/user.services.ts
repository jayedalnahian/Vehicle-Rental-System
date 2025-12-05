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



const getAllUsers = async () => {
    const result = pool.query(`SELECT id, name, email, phone, role FROM users`)
    return result;

}



const updateSingleUser = async (id: string, name?: string, email?: string, phone?: string, role?: string) => {
    const fields = []
    const values: any[] = []
    let index = 1

    if (name) {
        fields.push(`name = $${index++}`);
        values.push(name);
    }

    if (email) {
        fields.push(`email = $${index++}`);
        values.push(email.toLowerCase());
    }

    if (phone) {
        fields.push(`phone = $${index++}`);
        values.push(phone);
    }

    if (role) {
        fields.push(`role = $${index++}`);
        values.push(role);
    }


    if (fields.length === 0) {
        return { rows: [] };
    }

    values.push(id)


    const result = await pool.query(`UPDATE USERS SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, name, email, phone, role`, values)
    return result;
}


const deleteSingleUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
    return result;
}

export const userServices = {
    createUser, getAllUsers, updateSingleUser, deleteSingleUser
};