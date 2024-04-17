/** @type{import('fastify').FastifyPluginAsync<>} */

export default async function categories(app, options) {
    const categories = app.mongo.db.collection('categorias')
    const product = app.mongo.db.collection('products')

    app.get('/categories', 
        {
            config: {
                logMe: true
            }
        }, 
        async (req, rep) => {
        return await categories.find().toArray()
    }) 
    app.get('/categories/:id', async (req, rep) => {
        let id = req.params.id
        let category = await categories.findOne({_id: new app.mongo.ObjectId(id)})
        
        return category
    })

    app.get('/categories/:id/products', async (req, rep) => {
        let id = req.params.id
        let products = await product.find({cat_id: id}).toArray()

        return products
    })

    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    img_url: {type: 'string'}
                },
                required: ['name', 'img_url']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (req, rep) => {
        let category = req.body

        await categories.insertOne(category)

        return rep.code(201).send()
    })

    app.delete('/categories/:id', { 
        config: {
            requireAuthentication: true
        }
        }, async (req, rep) => {
        let id = req.params.id
        let categorie = await categories.deleteOne({_id: new app.mongo.ObjectId(id)})
        
        return rep.code(204).send()
    })

    app.put('/categories/:id', { 
        config: {
            requireAuthentication: true
        }}, async (req, rep) => {
        let id = req.params.id
        let category = req.body
        await categories.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set: {
                name: category.name,
                img_url: category.img_url
            }
        })
        
        return rep.code(204).send()
    })
}