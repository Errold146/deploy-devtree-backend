import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import cloudinary from '../config/cloudinary'

export const createAccount = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(409).json({ error: 'El usuario ya existe' })
        return
    }

    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        res.status(409).json({ error: 'Nombre de Usuario no disponible' })
        return
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()
    res.status(201).send('Registro Creado Correctamente')
}

export const login = async (req: Request, res: Response) => {

    // Manejar errores
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Revisar si el usuario esta registrado
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404).json({ error: 'El Usuario no existe' })
        return
    }

    // Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        res.status(401).json({ error: 'Password Incorrecto' })
        return
    }

    const token = generateJWT({ id: user._id })

    res.send(token)
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle })
        if (handleExists && req.user && handleExists.email !== req.user.email) {
            res.status(409).json({ error: 'Nombre de usuario no disponible' })
            return
        }

        // Actualizar el usuario
        if (!req.user) {
            res.status(400).json({ error: 'Usuario no autenticado' });
            return
        }
        req.user.description = description;
        req.user.handle = handle;
        req.user.links = links;
        await req.user.save();
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        res.status(500).json({ error: 'Hubo un error' })
        return
    }
}

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    const form = formidable({ multiples: false });

    form.parse(req, async (error, fields, files) => {
        if (error) {
            res.status(500).json({ error: 'Hubo un error al subir la imagen' });
            return;
        }

        try {
            if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
                res.status(400).json({ error: 'No se encontró ningún archivo para subir' });
                return;
            }
            const result = await cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() });
            if (req.user) {
                req.user.image = result.secure_url;
                await req.user.save();
            } else {
                res.status(400).json({ error: 'Usuario no autenticado' });
                return;
            }
            res.json({ image: result.secure_url });
        } catch (uploadError) {
            res.status(500).json({ error: 'Error al procesar la imagen' });
        }
    });
};

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({ handle }).select('-_id -__v -email -password')
        if (!user) {
            res.status(404).json({ error: 'El Usuario no existe' })
            return
        }
        res.json(user)
    } catch (e) {
        res.status(500).json({ error: 'Hubo un error' })
        return
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExists = await User.findOne({handle})
        if(userExists) {
            res.status(409).json({ error: `${handle} ya está registrado` })
            return
        }
        res.send(`${handle} está disponible`)
    } catch (e) {
        res.status(500).json({ error: 'Hubo un error' })
        return
    }
}