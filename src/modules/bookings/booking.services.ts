import { pool } from "../../config/db";
import { formatDate, priceCounter, queryFunction } from "./booking.utils";

const createBooking = async (customer_id: number, vehicle_id: number, rent_start_date: string, rent_end_date: string) => {
    const { vehicleResultQuery, insertQuery, updateVehicleStatusQuery } = queryFunction();
    const vehicleResult = await pool.query(vehicleResultQuery, [vehicle_id]);

    if (vehicleResult.rows.length === 0) {
        return []
    }
    if (vehicleResult.rows[0].availability_status !== 'available') {
        return []
    }
    const { total_price } = priceCounter(rent_start_date, rent_end_date, vehicleResult);
    const values = [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active'];
    const result = await pool.query(insertQuery, values);

    const booking = {
        ...result.rows[0],
        rent_start_date: formatDate(result.rows[0].rent_start_date),
        rent_end_date: formatDate(result.rows[0].rent_end_date),
        vehicle: {
            vehicle_name: vehicleResult.rows[0].vehicle_name,
            daily_rent_price: vehicleResult.rows[0].daily_rent_price
        }
    };
    try {
        await pool.query(updateVehicleStatusQuery, [vehicle_id])
    } catch {
        return []
    }
    return booking
}



export const bookingServices = { createBooking }