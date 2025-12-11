declare module 'node-cron';

import cron from "node-cron";
import { pool } from "../config/db";




cron.schedule("*/5 * * * *", async () => {
    try {
        const result = await pool.query(`
            UPDATE bookings
            SET status = 'returned'
            WHERE status = 'active'
            AND rent_end_date < NOW()
            RETURNING vehicle_id
            `)


        if (result.rows.length === 0) {
            console.log("No expired bookings found.");
            return
        }

        const vehicleIds = result.rows.map((row: { vehicle_id: number }) => row.vehicle_id);

        await pool.query(`
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = ANY($1::int[])   
            `, [vehicleIds])

        console.log("Auto-return completed for vehicles:", vehicleIds);

    } catch (error: any) {
        console.log('auto return error', error.message);

    }
})