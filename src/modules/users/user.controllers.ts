import { Request, Response } from "express";
import { userServices } from "./user.services";




const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsers()

        if (!result) {
            return res.status(400).json({
                status: false,
                message: "Interner server error!!"
            })
        }


        if (result.rows.length === 0) {
            return res.status(400).json({
                success: true,
                message: "No user found",
                data: result.rows
            })
        }

        res.status(201).json({
            status: true,
            message: "Users retrieved successfully",
            data: result.rows
        })


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error.message

        });
    }
}


const updateSingleUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { name, email, phone, role } = req.body;
        const result = await userServices.updateSingleUser(id as string, name, email, phone, role)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result.rows[0],
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'User not updated.',
            error: error.message,
        })
    }

}


const deleteSingleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await userServices.deleteSingleUser(id as string)

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: result,
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}


export const userControllers = {
    getAllUsers, updateSingleUser, deleteSingleUser
};