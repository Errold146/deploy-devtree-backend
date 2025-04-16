import { Router } from "express"
import { body } from 'express-validator'
import { createAccount, login, getUser, updateProfile, uploadImage, getUserByHandle, searchByHandle } from 
"./handlers/index.ts"
import { authenticate, handleInputErrors } from "./middleware/index.ts"

const router = Router()

/** Auth and Register **/
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('Emial obligatorio - formato incorrecto'),
    body('password')
        .isLength({min: 8})
        .withMessage('Password obligatorio - muy corto'),
    handleInputErrors,
    createAccount 
)

router.post('/auth/login', 
    body('email')
        .isEmail()
        .withMessage('Emial obligatorio - formato incorrecto'),
    body('password')
        .notEmpty()
        .withMessage('Password obligatorio'),
    handleInputErrors,
    login 
)

router.get('/user', authenticate, getUser ) 

router.patch('/user', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    authenticate, 
    updateProfile 
)

router.post('/user/image', authenticate, uploadImage )

router.get('/:handle', getUserByHandle )

router.post('/search', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    searchByHandle 
)

export default router