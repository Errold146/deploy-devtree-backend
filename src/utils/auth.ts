import bcrypt from 'bcrypt'

// Encrypt the password
export const hashPassword = async ( pass: string ) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(pass, salt)
}

// Check password
export const checkPassword = async ( enteredPass: string, hash: string ) => {
    return await bcrypt.compare(enteredPass, hash)
}