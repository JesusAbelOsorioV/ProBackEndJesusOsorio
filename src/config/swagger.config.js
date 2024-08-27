import { __dirname } from "../utils.js";

export const swaggerOptions ={
    definition: {
        openapi: '3.0.1',
        info:{
            title: 'Documentación de ecommers Jesus Osorio',
            description: 'API para documentar app ecommers Jesus Osorio'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}