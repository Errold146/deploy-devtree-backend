interface CorsConfig {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
}

export const corsConfig: CorsConfig = {
    origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
        console.log("Origin recibido:", origin);
        const whiteList: (string | undefined)[] = [
            process.env.FRONTEND_URL,
            'https://aesthetic-heliotrope-cde61c.netlify.app'
        ]

        if (whiteList.includes(origin)) {
            callback(null, true);
        } else {
            console.error("CORS bloqueado para origin:", origin);
            callback(new Error('Error de CORS'));
        }
    }
};