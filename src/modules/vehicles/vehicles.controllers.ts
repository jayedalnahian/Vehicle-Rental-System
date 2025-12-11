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


const getAllVehicles = async (req: Request, res: Response) => {
    try {

        const result = await vehiclesServices.getAllVehicles()
        if (!result) {
            return res.status(400).json({
                status: false,
                message: "Interner server error!!"
            })
        }


        if (result.rows.length === 0) {
            return res.status(400).json({
                success: true,
                message: "No vehicles found",
                data: result.rows
            })
        }

        res.status(201).json({
            status: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Interner server error!",
            error: error.message
        })
    }
}


const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params
        const result = await vehiclesServices.getSingleVehicle(vehicleId as string)

        res.status(201).json({
            status: true,
            message: "Vehicle retrieved successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Interner server error!",
            error: error.message
        })
    }
}


const updateSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

        const result = await vehiclesServices.updateSingleVehicle(vehicleId as string, vehicle_name, type, registration_number, daily_rent_price, availability_status)

        res.status(201).json({
            status: true,
            message: "Vehicle updated successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Interner server error!",
            error: error.message
        })
    }
}

const deleteSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params



        
        const result = await vehiclesServices.deleteSingleVehicle(vehicleId as string)
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully',
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Interner server error!",
            error: error.message
        })
    }
}

export const vehiclesControllers = { createVehicle, deleteSingleVehicle, getAllVehicles, getSingleVehicle, updateSingleVehicle }