import fastify from 'fastify'
import dotenv from 'dotenv'
import mongodb from '@fastify/mongodb'
import autoload from '@fastify/autoload'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

export const options = { 
    stage: process.env.STAGE,
    port: process.env.PORT,
    host: process.env.HOST,
    logger: process.env.STAGE === 'dev' ? {transport : {target: 'pino-pretty'}} : false,
    jwt_secret: process.env.JWT_SECRET,
    db_url: process.env.DB_URL
}

export async function builder(opts){
    const app = fastify(opts)

    await app.register(mongodb, {
        url: opts.db_url
    })

    await app.register(jwt, {
        secret: opts.jwt_secret
    })

    await app.register(cors, {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    })

    await app.register(autoload, {
        dir: path.join(__dirname, 'hooks'),
        encapsulate: false,
        ignoreFilter: (path) => {
            return path.includes('functions')
        }
    })

    await app.register(autoload, {
        dir: path.join(__dirname, 'routes')
    })

    return app
}