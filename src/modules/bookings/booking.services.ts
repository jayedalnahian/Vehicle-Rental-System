import { pool } from "../../config/db";
import { MyJwtPayload } from "../../types/jwt";
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

const getAllBookings = async (userRole: string, userId: string) => {
    if (userRole === 'admin') {
        const result = await pool.query(`
        SELECT
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            json_build_object('name', u.name, 'email', u.email) AS customer,
            json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        ORDER BY b.id DESC;
            `);
        // {
        //     "id": 1,
        //         "customer_id": 1,
        //             "vehicle_id": 2,
        //                 "rent_start_date": "2024-01-15",
        //                     "rent_end_date": "2024-01-20",
        //                         "total_price": 250,
        //                             "status": "active",
        //                                 "customer": {
        //         "name": "John Doe",
        //             "email": "john.doe@example.com"
        //     },
        //     "vehicle": {
        //         "vehicle_name": "Honda Civic 2023",
        //             "registration_number": "XYZ-5678"
        //     }
        // }

        return result.rows;
    }


    if (userRole === "customer") {
        // {
        //     "success": true,
        //         "message": "Your bookings retrieved successfully",
        //             "data": [
        //                 {
        //                     "id": 1,
        //                     "vehicle_id": 2,
        //                     "rent_start_date": "2024-01-15",
        //                     "rent_end_date": "2024-01-20",
        //                     "total_price": 250,
        //                     "status": "active",
        //                     "vehicle": {
        //                         "vehicle_name": "Honda Civic 2023",
        //                         "registration_number": "XYZ-5678",
        //                         "type": "car"
        //                     }
        //                 }
        //             ]
        // }
        const result = await pool.query(`
            SELECT 
                b.id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,
                json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
                FROM bookings b
                JOIN vehicles v ON b.vehicle_id = v.id
                WHERE b.customer_id = $1
                ORDER BY b.id DESC;
                `, [userId])


        return result.rows;
    }
}


const updateBooking = async (id: string, user: MyJwtPayload, body: any) => {
    const booking = await pool.query(`
        SELECT * FROM bookings WHERE id = $1
        `, [id])


    if (booking.rows.length === 0) {
        throw new Error("Booking not found")
    }

    const data = booking.rows[0]


    if (user.role === "customer" && body.status === "cancelled") {
        const cancleResult = await pool.query(`
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = $1
            AND customer_id = $2
            AND status IN ('active')
            RETURNING *
            `, [data.id, user.id])


        if (cancleResult.rows.length === 0) {
            throw new Error("You cannot cancel this booking")
        }

        return {
            message: "booking cancelled successfully!",
            data: cancleResult.rows[0]
        }
    }


    if (user.role === "admin" && body.status === "returned") {
        const bookingUpdate = await pool.query(`
            UPDATE bookings
            SET status = 'returned'
            WHERE id = $1
            RETURNING *
            `, [id])


        const updatedBooking = bookingUpdate.rows[0]


        const vehicleUpdate = await pool.query(`
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = $1
            RETURNING *  
            `, [updatedBooking.vehicle_id])


        return {
            message: "Booking marked as returned. Vehicle is now available",
            data: {
                ...updatedBooking,
                vehicle: {availability_status: vehicleUpdate.rows[0].availability_status}
            }
        }
    }

    throw new Error("Invalid role or status update request");
}



export const bookingServices = { createBooking, getAllBookings, updateBooking }