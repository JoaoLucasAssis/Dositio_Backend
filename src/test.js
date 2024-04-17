import { test, describe} from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { builder, options } from './app.js';
import { access } from 'node:fs';

const jwtValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWF0aGV1cyIsImlhdCI6MTcxMjY5Nzc4MX0.tb86bidxFw0aVwDm6l7RdXFB7RqxVrCf3bCosif0Fkg'

const CreateProductTest = {
    name: 'TestProduct11',
    qtd: '15',
    cat_id: '6616ca6fc0c1625999b9ef7f'
}

const CreateCategorieTest = {
    name: 'TestCategorie',
    img_url: 'https://www.modernenglishteacher.com/media/26176/rsz_testing_2.jpg'
}

const CreateUserTest = {
    name: 'TestUser67',
    password: 'ABCDe1234567',
    admin: false
}

const CreateUserAdminTest = {
    name: 'TestUser68',
    password: 'ABCDe1234567',
    admin: true
}

const UpdateProductTest = {
    name: 'TestProduct700',
    qtd: '10',
    cat_id: '6616ca6fc0c1625999b9ef7f'
}

const UpdateCategorieTest = {
    name: 'Testedcategorie',
    img_url: 'https://www.effiliation.com/wp-content/uploads/2018/10/test.png'
    
}

const AlreadyExists = {
    name: 'TestProduct',
    qtd: 100,
    cat_id: '6616c8ef2550bf9d500d198d'
}

// ================================
//     Tests for server config
// ================================
describe('### Tests for server config', async(t) => {
    // Testing options configuration file
    test('Testing options configuration file', async (t) => {
        const app = await builder(options);
    
        t.after(async() => {
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
describe('### Tests for unauthenticated routes', async(t) => {

    // Success request
   describe('##Success Request', async(t) => {
        // GET /products
        test('# GET /products', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close()
            })

            const response = await app.inject({
                method: 'GET',
                url: '/products'
            })
            equal(response.statusCode, 200)
        })

        // GET /products:id
        test('# GET /products/:id', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close()
            })

            const response = await app.inject({
                method: 'GET',
                url: '/products/6616ca5a7c88395ea9a658aa'
            })
            equal(response.statusCode, 200)
        })

        // GET /categories
        test('# GET /categories', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close()
            })
            const response = await app.inject({
                method: 'GET',
                url: '/categories'
            })
            equal(response.statusCode, 200)
        })

        // GET /categories/:id
        test('# GET /categories/:id', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close();
            })
            const response = await app.inject({
                method: 'GET',
                url: '/categories/6616c923616ab9efb0a94e97'
            })
            equal(response.statusCode, 200)
        })

        // GET /categories/:id/products
        test('# GET /categories/:id/products', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close()
            })
            const response = await app.inject({
                method: 'GET',
                url: '/categories/:id/products'
            })
            equal(response.statusCode, 200)
        })
   })

    // Bad request
    describe('##Bad Request', async(t) => {
        // PUT /categories/:id
        test('# no token', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close()
            })

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/6616ca5a7c88395ea9a658a9',
                body: UpdateCategorieTest,
                headers: {
                    
                }
            })
            equal(response.statusCode, 401)
        });
        
        // PUT /categories/:id
        test('# invalid token', async(t) => {
            const app = await builder(options)
    
            t.after(async() => {
                await app.close()
            })

            let originalString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWF0aGV1cyIsImlhdCI6MTcxMjY5Nzc4MX0.tb86bidxFw0aVwDm6l7RdXFB7RqxVrCf3bCosif0Fkg"
            let newString = originalString.replace("e", "")

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/6616ca5a7c88395ea9a658a9',
                body: UpdateCategorieTest,
                headers: {
                    'x-access-token': newString
                }
            });
            equal(response.statusCode, 401)
        })

        // POST /products
        test('# Already exists', async(t) => {
            const app = await builder(options)

            t.after(async() => {
            await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: AlreadyExists,
                headers: {
                    'x-access-token': jwtValue
                }
            })
            equal(response.statusCode, 412)
        })
    })
})

// ================================
//  Tests for authenticated routes
// ================================
describe('### Tests for authenticated routes', async(t) => {

    // Success request
    describe('##Success Request', async(t) => {
        // POST /categories
        test('# POST /categories', async(t) => {
            const app = await builder(options)

            t.after(async() => {
            await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: CreateCategorieTest,
                headers: {
                    'x-access-token': jwtValue
                }
            })
            equal(response.statusCode, 201)
        })

        // // PUT /categories/:id
        test('# PUT /categories', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close()
            })

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/6616ca5a7c88395ea9a658a9',
                body: UpdateCategorieTest,
                headers: {
                    'x-access-token': jwtValue
                }
            })
            equal(response.statusCode, 204)
        })

        // // DELETE /categories/:id
        test('# DELETE /categories', async(t) => {
            const app = await builder(options)

            t.after(async() => {
            await app.close()
            })

            const response = await app.inject({
                method: 'DELETE',
                url: '/categories/661d649a12b97fdbce8aa7b1',
                headers: {
                    'x-access-token': jwtValue
                }
            });
            equal(response.statusCode, 204)
        })

        // // POST /products
        test('# POST /products', async(t) => {
            const app = await builder(options)

            t.after(async() => {
            await app.close()
            })

            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: CreateProductTest,
                headers: {
                    'x-access-token': jwtValue
                }

            })
            equal(response.statusCode, 201)
        })

        // // PUT /products/:id
        test('# PUT /products', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'PUT',
                url: '/products/6616d5f4354be05aa2f2f9db',
                body: UpdateProductTest,
                headers: {
                    'x-access-token': jwtValue
                }

            });
            equal(response.statusCode, 204);
        })

        // // DELETE /products/:id
        test('# DELETE /products', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'DELETE',
                url: '/products/66197b2a04864e4f88a09220',
                headers: {
                    'x-access-token': jwtValue
                }

            });
            equal(response.statusCode, 204);
        })

        // POST /register
        test('# POST /register', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'POST',
                url: '/register',
                body: CreateUserTest,
                headers: {
                    'x-access-token': jwtValue
                }

            });
            equal(response.statusCode, 201);
        })

        // POST /register-admin
        test('# POST /register-admin', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'POST',
                url: '/register-admin',
                body: CreateUserAdminTest,
                headers: {
                    'x-access-token': jwtValue
                }

            });
            equal(response.statusCode, 201);
        })

        // POST /login
        test('# POST /login', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'POST',
                url: '/login',
                body: CreateUserTest,
            });
            equal(response.x-access-token, app.jwt.sign(CreateUserAdminTest))
        })

        // POST /login-admin
        test('# POST /login-admin', async(t) => {
            const app = await builder(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'POST',
                url: '/login-admin',
                body: CreateUserAdminTest,
            });
            equal(response.admin-token, app.jwt.sign(CreateUserAdminTest))
        })
    })
})