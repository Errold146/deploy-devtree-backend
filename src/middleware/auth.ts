import type { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { User, type IUser } from "../models"

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const bearer = req.headers.authorization;
        if (!bearer) {
            res.status(401).json({ error: "No Autorizado" });
            return
        }

        const [, token] = bearer.split(' ')
        if (!token) {
            res.status(401).json({ error: 'No Autorizado' })
            return
        }

        const result = jwt.verify(token, process.env.JWT_SECRECT)
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password -__v')
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' })
                return
            }
            req.user = user
            next()
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no válido' })
        next(error)
    }
}