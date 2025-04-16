import mongoose from 'mongoose'
import colors from 'colors'

export const connectDB = async () =>  {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        const url = `${connection.host}:${connection.port}`
        console.log(colors.cyan.bold( `MongoDB Conectado en ${url}`) )
    } catch (error) {
        if (error instanceof Error) {
            console.log(colors.bgRed.white.bold(error.message));
        } else {
            console.log(colors.bgRed.white.bold('An unknown error occurred'));
        }
        process.exit(1)
    }
}