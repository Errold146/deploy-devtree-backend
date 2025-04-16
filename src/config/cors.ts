import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        // En desarrollo permitimos cualquier origen
        if (origin === process.env.FRONTEND_URL || origin === undefined ) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
};