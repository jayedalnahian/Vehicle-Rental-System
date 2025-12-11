import { pool } from "../../config/db";

const createVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {

    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )

    return result.rows[0];
}

const getAllVehicles = async () => {
    const result = pool.query(`SELECT * FROM vehicles`)
    return result;
}


const getSingleVehicle = async (vehicleId: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
    return result.rows[0];
}

const updateSingleVehicle = async (vehicleId: string, vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId]
    )

    return result.rows[0];
}


const deleteSingleVehicle = async (id: string) => {
    const userCheck = await pool.query(`
        SELECT * FROM vehicles WHERE id = $1
        `, [id])


    if (userCheck.rows.length === 0) {
        throw new Error("Vehicle not found");
    }


    const bookingCheck = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [id]
    );

    if (bookingCheck.rows.length > 0) {
        throw new Error("Vehicle cannot be deleted because vehicle have active bookings");
    }


    const deleteResult = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
        [id]
    );

    return deleteResult.rows[0];
}

export const vehiclesServices = { deleteSingleVehicle, createVehicle, getAllVehicles, getSingleVehicle, updateSingleVehicle };