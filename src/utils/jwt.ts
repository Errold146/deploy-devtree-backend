import jtw, { JwtPayload } from 'jsonwebtoken'

export const generateJWT = ( payload: JwtPayload ) => {
    const token = jtw.sign(payload, process.env.JWT_SECRECT, {
        expiresIn: '1d'
    })

    return token
}