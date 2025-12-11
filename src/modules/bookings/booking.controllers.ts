import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { MyJwtPayload } from "../../types/jwt";

const createBooking = async (req: Request, res: Response) => {
    //     {
    //   "customer_id": 1,
    //   "vehicle_id": 2,
    //   "rent_start_date": "2024-01-15",
    //   "rent_end_date": "2024-01-20"
    // }
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
    try {


        if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
            return res.status(400).json({
                success: false,
                message: "All fields (customer_id, vehicle_id, rent_start_date, rent_end_date) are required."
            });
        }

        // Validate date format & convert to Date objects
        const start = new Date(rent_start_date);
        const end = new Date(rent_end_date);
        const today = new Date();


        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD."
            });
        }

        //start date must be >= today

        today.setHours(0, 0, 0, 0);
        if (start < today) {
            return res.status(400).json({
                success: false,
                message: "rent_start_date cannot be earlier than today."
            });
        }
        //end date must be after start date
        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: "rent_end_date must be after rent_start_date."
            });
        }


        const result = await bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);

        if (Object.keys(result).length === 0) {
            return res.status(400).json({
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

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const userRole = req.user?.role;
        const userId = req.user?.id;
        const result = await bookingServices.getAllBookings(userRole as string, `${userId}`);

        console.log("User from token:", req.user);
        console.log("Role:", userRole);
        console.log("UserId:", userId);

        if (result?.length === 0) {
            res.status(401).json({
                success: false,
                message: "No booking found, or you are not eligible to access certain bookings!",
                data: result || []
            })
        }


        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully!",
            data: result || []
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve bookings. Server error!",
            error: error.message
        })
    }
}


const updateBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { id } = req.params
        const body = req.body
        const result: any = await bookingServices.updateBooking(id as string, user as MyJwtPayload, body as any)


        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve bookings. Server error!",
            error: error.message
        })
    }
}
export const bookingControllers = { createBooking, getAllBookings, updateBooking }