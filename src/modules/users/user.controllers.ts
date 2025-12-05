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
            message: error.message 
        });
    }
}



export const userControllers = {
    createUser,
};