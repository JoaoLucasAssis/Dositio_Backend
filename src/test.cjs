const { test, describe } = require('node:test')
const { equal, deepEqual } = require('node:assert')
const { builder, options } = require('./app.js');

/*
SCRIPT PARA TESTE DAS ROTAS DA API


Um banco de dados de teste foi criado para que a manipulação das rotas não afete o banco de dados da aplicação
--> mongodb://localhost:27017/teste

Para funcionamento das rotas de GET /*, foi criado previamente um item para cada coleção abaixo:
* Obs: para a rota POST /login e /login-admin, o usuário utilizado é criado pela rota /register e /register-admin

Coleção de Categorias:
{
  "_id": {
    "$oid": "661d9cf8ad84d4573574d57c"
  },
  "name": "TesteCategory1",
  "img_url": "https://static.itdg.com.br/images/622-auto/ed4c4a501ed88775e87f279b2ced50c6/frutas-mais-saudaveis.jpg"
}

Coleção de Produtos:
{
  "_id": {
    "$oid": "66215a14683ecf32e0dd6ebf"
  },
  "name": "TestProduct34",
  "qtd": 34,
  "cat_id": "661d9cf8ad84d4573574d57c"
}

Para executar o script de teste, basta digitar o seguinte comando no terminal:
--> npm run test
*/

const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWF0aGV1cyIsImlhdCI6MTcxMjY5Nzc4MX0.tb86bidxFw0aVwDm6l7RdXFB7RqxVrCf3bCosif0Fkg'

// Variables for POST routes
const CreateProductTest = {
    name: 'TestProduct',
    qtd: 15,
    cat_id: '661d9cf8ad84d4573574d57c' // cat_id do TestCategory1
}
const CreateCategoryTest = {
    name: 'TestCategory',
    img_url: 'https://www.modernenglishteacher.com/media/26176/rsz_testing_2.jpg'
}
const CreateUserTest = {
    name: 'TestUser1',
    password: 'senha1',
    admin: false
}
const CreateUserAdminTest = {
    name: 'TestUser2',
    password: 'senha2',
    admin: true
}

// Variables for PUT routes
const UpdateProductTest = {
    name: 'TestProduct',
    qtd: 35,
    cat_id: '661d9cf8ad84d4573574d57c' // cat_id do TestCategory1
}
const UpdateCategoryTest = {
    name: 'TestCategory',
    img_url: 'https://www.effiliation.com/wp-content/uploads/2018/10/test.png'

}
const AlreadyExists = {
    name: 'TestProduct',
    qtd: 15,
    cat_id: '661d9cf8ad84d4573574d57c' // cat_id do TestCategory1
}

// ================================
//     Tests for server config
// ================================
describe('### Tests for server config', async (t) => {
    // Testing options configuration file
    test('Testing options configuration file', async (t) => {
        const app = await builder(options);

        t.after(async () => {
            await app.close();
        });

        deepEqual(options.stage, 'test');
        deepEqual(options.port, '3000');
        deepEqual(options.host, '127.0.0.1');
        deepEqual(options.jwt_secret, 'Abcd@1234');
        deepEqual(options.db_url, 'mongodb://localhost:27017/teste');

    });
});

// ================================
// Tests for unauthenticated routes
// ================================
describe('### Tests for unauthenticated routes', async (t) => {

    // Success request
    describe('##Success Request', async (t) => {
        // GET /products
        test('# GET /products', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'GET',
                url: '/products'
            })
            equal(response.statusCode, 200)
        })

        // GET /products:id
        test('# GET /products/:id', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'GET',
                url: '/products/66215a14683ecf32e0dd6ebf'
            })
            equal(response.statusCode, 200)
        })

        // GET /categories
        test('# GET /categories', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })
            const response = await app.inject({
                method: 'GET',
                url: '/categories'
            })
            equal(response.statusCode, 200)
        })

        // GET /categories/:id
        test('# GET /categories/:id', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close();
            })
            const response = await app.inject({
                method: 'GET',
                url: '/categories/661d9cf8ad84d4573574d57c' // id do TestCategory
            })
            equal(response.statusCode, 200)
        })

        // GET /categories/:id/products
        test('# GET /categories/:id/products', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })
            const response = await app.inject({
                method: 'GET',
                url: '/categories/661d9cf8ad84d4573574d57c/products' // id do TestCategory
            })
            equal(response.statusCode, 200)
        })
    })

    // Bad request
    describe('##Bad Request', async (t) => {
        // no token - PUT /categories/:id
        test('# no token', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/661d9cf8ad84d4573574d57c',
                body: UpdateCategoryTest,
                headers: {

                }
            })
            equal(response.statusCode, 401)
        });

        // invalid token - PUT /categories/:id
        test('# invalid token', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            let invalidJwt = jwt.replace("e", "")

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/661d9cf8ad84d4573574d57c',
                body: UpdateCategoryTest,
                headers: {
                    'x-access-token': invalidJwt
                }
            });
            equal(response.statusCode, 401)
        })

        // Already exists - POST /products
        test('# Already exists', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: AlreadyExists,
                headers: {
                    'x-access-token': jwt
                }
            })
            equal(response.statusCode, 412)
        })
    })
})

// ================================
//  Tests for authenticated routes
// ================================
describe('### Tests for authenticated routes', async (t) => {

    // Success request
    describe('##Success Request', async (t) => {
        // POST /categories
        test('# POST /categories', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: CreateCategoryTest,
                headers: {
                    'x-access-token': jwt
                }
            })
            equal(response.statusCode, 201)
        })

        // // PUT /categories/:id
        test('# PUT /categories', async (t) => {
            const app = await builder(options);

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/661d9cf8ad84d4573574d57c',
                body: UpdateCategoryTest,
                headers: {
                    'x-access-token': jwt
                }
            })
            equal(response.statusCode, 204)
        })

        // // DELETE /categories/:id
        test('# DELETE /categories', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'DELETE',
                url: '/categories/661d9cf8ad84d4573574d57c',
                headers: {
                    'x-access-token': jwt
                }
            });
            equal(response.statusCode, 204)
        })

        // // POST /products
        test('# POST /products', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: CreateProductTest,
                headers: {
                    'x-access-token': jwt
                }

            })
            equal(response.statusCode, 201)
        })

        // // PUT /products/:id
        test('# PUT /products', async (t) => {
            const app = await builder(options);

            t.after(async () => {
                await app.close();
            });

            const response = await app.inject({
                method: 'PUT',
                url: '/products/66215a14683ecf32e0dd6ebf',
                body: UpdateProductTest,
                headers: {
                    'x-access-token': jwt
                }

            });
            equal(response.statusCode, 204);
        })

        // // DELETE /products/:id
        test('# DELETE /products', async (t) => {
            const app = await builder(options);

            t.after(async () => {
                await app.close();
            });

            const response = await app.inject({
                method: 'DELETE',
                url: '/products/66215a14683ecf32e0dd6ebf',
                headers: {
                    'x-access-token': jwt
                }

            });
            equal(response.statusCode, 204);
        })

        // POST /register
        test('# POST /register', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/register',
                body: CreateUserTest,
                headers: {
                    'x-access-token': jwt
                }

            })
            equal(response.statusCode, 201)
        })

        // POST /register-admin
        test('# POST /register-admin', async (t) => {
            const app = await builder(options)

            t.after(async () => {
                await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/register-admin',
                body: CreateUserAdminTest,
                headers: {
                    'x-access-token': jwt
                }

            })
            equal(response.statusCode, 201)
        })

        // POST /login
        // test('# POST /login', async(t) => {
        //     const app = await builder(options)

        //     t.after(async() => {
        //     await app.close()
        //     })

        //     const response = await app.inject({
        //         method: 'POST',
        //         url: '/login',
        //         body: CreateUserTest,
        //     })
        //     equal(response.x-access-token, app.jwt.sign(CreateUserAdminTest))
        // })

        // // POST /login-admin
        // test('# POST /login-admin', async(t) => {
        //     const app = await builder(options)

        //     t.after(async() => {
        //     await app.close()
        //     })

        //     const response = await app.inject({
        //         method: 'POST',
        //         url: '/login-admin',
        //         body: CreateUserAdminTest,
        //     })
        //     equal(response.admin-token, app.jwt.sign(CreateUserAdminTest))
        // })
    })
})