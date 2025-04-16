import jwt, { JwtPayload } from 'jsonwebtoken'

interface JwtPayloadData {
    [key: string]: any; // Adjust this to match the expected structure of your payload
}

export const generateJWT = (payload: JwtPayloadData): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    });
    return token;
};