import mongoose from "mongoose"
import colors from 'colors'

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        const url = `${connection.host} : ${connection.port}`

        console.log( colors.cyan(`MongoDb connected in: ${url}`))

    } catch (error) {
        if (error instanceof Error) {
            console.log(colors.bgRed(error.message));
        } else {
            console.log(colors.bgRed("An unknown error occurred"));
        }
        process.exit(1)
    }
}