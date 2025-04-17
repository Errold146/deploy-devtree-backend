interface CorsConfig {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
}

export const corsConfig: CorsConfig = {
    origin: function (origin, callback) {
        const whiteList = [
            process.env.FRONTEND_URL,
            'https://aesthetic-heliotrope-cde61c.netlify.app'
        ];

        // Permitir solicitudes sin origen (undefined) de forma controlada
        if (!origin || whiteList.includes(origin)) {
            callback(null, true); // Permite la solicitud
        } else {
            console.error("CORS bloqueado para origin:", origin);
            callback(new Error('Error de CORS')); // Bloquea la solicitud
        }
    }
};