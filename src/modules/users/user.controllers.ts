import { Request, Response } from "express";
import { userServices } from "./user.services";


const createUser = async (req: Request, res: Response) => {
    console.log(req);

    try {
        const { name, email, password, phone, role } = req.body;


        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, and phone are required.'
            });
        }

        if (!['admin', 'customer'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be either admin or customer.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format.'
            });
        }
        if (!/^\+?[0-9]{7,15}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format.'
            });
        }

        const newUser = await userServices.createUser({ name, email, password, phone, role });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: error.message

        });
    }
}


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
            data: result.rows[0],
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
    createUser, getAllUsers, updateSingleUser, deleteSingleUser
};