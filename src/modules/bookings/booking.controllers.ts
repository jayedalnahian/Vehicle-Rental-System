import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
//     {
//   "customer_id": 1,
//   "vehicle_id": 2,
//   "rent_start_date": "2024-01-15",
//   "rent_end_date": "2024-01-20"
// }
    const {customer_id, vehicle_id, rent_start_date, rent_end_date} = req.body;
    try {
        const result = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);
        
        if (Object.keys(result).length === 0) {
            return  res.status(400).json({
                success: false,
                message: "Booking creation failed. Vehicle not available or does not exist!"
            })
        }
        
        res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            data: result
        })






    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Booking creation failed. Server error!",
            error: error.message
        })
    }
}

export const bookingControllers = { createBooking }