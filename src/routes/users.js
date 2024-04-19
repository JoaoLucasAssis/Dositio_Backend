/** @type{import('fastify').FastifyPluginAsync<>} */
import { USER_NOT_FOUND, USER_NOT_ADMIN } from "../libs/error.js"

export default async function user(app, options) {
    const mongodb_users = app.mongo.db.collection('users')
    
    app.post('/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    password: {type: 'string'},
                    admin: {type: 'boolean'}
                },
                required: ['name', 'password', 'admin']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (req, rep) => {
        let user = req.body

        await mongodb_users.insertOne(user)

        return rep.code(201).send()
    })

    app.post('/register-admin', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    password: {type: 'string'},
                    admin: {type: 'boolean'}
                },
                required: ['name', 'password', 'admin']
            }
        },
        config: {
            requireAuthentication: true,
            isAdmin: true
        }
    }, async (req, rep) => {
        let user = req.body

        await mongodb_users.insertOne(user)

        return rep.code(201).send()
    })

    app.post('/login', async (req, rep) => {
        let user = req.body;

        let result = await mongodb_users.count({name: user.name})
        if(result <= 0) throw new USER_NOT_FOUND()

        delete user.password
        
        return {
            'x-access-token': app.jwt.sign(user)
        }
    })

    app.post('/login-admin', async (req, rep) => {
        let user = req.body;

        let result = await mongodb_users.count({name: user.name, admin: true})
        if(result <= 0) throw new USER_NOT_ADMIN()

        delete user.password
        
        return {
            'admin-token': app.jwt.sign(user)
        }
    })
}