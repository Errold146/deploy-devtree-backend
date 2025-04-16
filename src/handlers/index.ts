import type { Request, Response, NextFunction } from "express"
import slug from 'slug'
import formidable from "formidable"
import { v4 as uuid } from 'uuid'
import { User } from "../models/User.ts"
import { checkPassword, generateJWT, hashPassword } from "../utils/index.ts"
import { cloudinary } from "../config/index.ts"

export const createAccount = async ( req: Request, res: Response, next: NextFunction ):
Promise<void> => {
    try {

        const { email, password } = req.body

        // Check if the email is already registered
        const userExist = await User.findOne({ email })
        if (userExist) {
            res.status(409).json({ error: "Email registrado anteriormente" })
            return
        }

        // Check if the handle is available
        const handle = slug(req.body.handle, '_')
        const handleExist = await User.findOne({ handle })
        if (handleExist) {
            res.status(409).json({ error: "El handle no esta disponible" })
            return
        }
        
        // Create the user and encrypt the password
        const user = new User(req.body)
        user.password = await hashPassword(password)
        user.handle = handle
        await user.save()

        // Success message
        res.status(201).send("Usuario creado correctamente")

    } catch (error) {
        next(error) // This helps in case of unexpected errors.
        res.status(500).json({ error: error.message })
    }
}

export const login = async ( req: Request, res: Response, next: NextFunction ) => {
    try {

        const { email, password } = req.body

        // Check if the user is registered
        const user = await User.findOne({ email })
        if ( !user ) {
            res.status(404).json({ error: "Email no registrado" })
            return
        }

        // Check the validity of the password
        const isPassCorrect = await checkPassword(password, user.password)
        if ( !isPassCorrect ) {
            res.status(401).json({ error: "Password incorrecto" })
            return
        }

        const token = generateJWT({id: user.id})

        res.send(token)

    } catch (error) {
        next(error) // This helps in case of unexpected errors.
        res.status(500).json({ error: error.message })
    }
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '_')
        const handleExist = await User.findOne({ handle })
        if ( handleExist && handleExist.email !== req.user.email ) {
            res.status(409).json({ error: "El handle no esta disponible" })
            return
        }

        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.status(200).send("Perfil actualizado correctamente")

    } catch (error) {
        next(error) // This helps in case of unexpected errors.
        res.status(500).json({ error: error.message })
    }
}


export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {

    const form = formidable({ multiples: false })
    
    try {
        form.parse(req, ( err, fields, files ) => {

            cloudinary.uploader.upload( files.file[0].filepath, { public_id: uuid() }, 
                async function(error, result) {
                    if ( error ) {
                        res.status(500).json({ error: "Error al subir la imagen" })
                        return
                    }
                    if ( result ) {
                        req.user.image = result.secure_url
                        await req.user.save()
                        res.status(200).json({ msg: "Imagen subida correctamente", image: result.secure_url })
                    }
                }
            )

        })
        

    } catch (error) {
        next(error) // This helps in case of unexpected errors.
        res.status(500).json({ error: error.message }) 
    }
}

export const getUserByHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({ handle }).select('-password -__v -_id -email')
        if(!user) {
            res.status(404).json({ error: "Usuario no encontrado" })
            return
        }
        res.status(200).json(user)

    } catch (error) {
        next(error) // This helps in case of unexpected errors.
        res.status(500).json({ error: error.message }) 

    }
}

export const searchByHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { handle } = req.body
        const userExist = await User.findOne({ handle })
        if ( userExist ) {
            res.status(409).json({ error: `El handle: ${handle}, ya existe` })
            return
        }
        res.status(200).send("Handle disponible")

    } catch (error) {
        next(error) // This helps in case of unexpected errors.
        res.status(500).json({ error: error.message })
        
    }
}