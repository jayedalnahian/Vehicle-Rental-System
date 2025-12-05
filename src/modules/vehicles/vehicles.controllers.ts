import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const createVehicle = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {

        const result = await vehiclesServices.createVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status)
        if (!result) {
            return res.status(400).json({
                status: false,
                message: "Vehicle creation failed!"
            })
        }

        res.status(201).json({
            status: true,
            message: "Vehicle created successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: "Internal server error!",
            error: error.message
        })

    }
}

export const vehiclesControllers = { createVehicle }