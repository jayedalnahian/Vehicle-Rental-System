import { pool } from "../../config/db";
import bcrypt from "bcryptjs"





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
    const userCheck = await pool.query(`
        SELECT * FROM users WHERE id = $1
        `, [id])


    if (userCheck.rows.length === 0) {
        throw new Error("User not found");
    }


    const bookingCheck = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
        [id]
    );

    if (bookingCheck.rows.length > 0) {
        throw new Error("User cannot be deleted because they have active bookings");
    }


    const deleteResult = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [id]
    );

    return deleteResult.rows[0];

}

export const userServices = {
 getAllUsers, updateSingleUser, deleteSingleUser
};