import { Request, Response } from "express"
import { authServices } from "./auth.services"
import config from "../../config"
import jwt from "jsonwebtoken"
import { MyJwtPayload } from '../../types/jwt';

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

        const newUser = await authServices.createUser({ name, email, password, phone, role });
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



const createLogin = async (req: Request, res: Response) => {

    const { email, password } = req.body

    try {
        const result = await authServices.login(email, password)

        const token = jwt.sign({
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role
        }, config.jwtSecret, { expiresIn: '7d' })


        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Login failed. Token generation error!"
            })
        }
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded as MyJwtPayload;



        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: {
                token: token,
                user: result
            }
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Login failed. Server error!",
            error: error.message
        })
    }
}


export const authControllers = {createUser, createLogin }