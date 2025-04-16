import colors from 'colors'
import app from "./server.ts"

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log( colors.blue.italic('Servidor Funcionando en el Puerto: '), port)
})