import { test, describe} from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { builder, options } from './app.js';
import { access } from 'node:fs';

const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWF0aGV1cyIsImlhdCI6MTcxMjY5Nzc4MX0.tb86bidxFw0aVwDm6l7RdXFB7RqxVrCf3bCosif0Fkg'
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiam9hbyIsImFkbWluIjp0cnVlLCJpYXQiOjE3MTM1MjU1NzN9.tvfz1dYF0SMjuFWHTgV_ixOeQKF0oFoY7uzdcygO6zo'

const CreateProductTest = {
    name: 'TestProduct',
    qtd: '15',
    cat_id: '66224d85930b03e1d408f6b5'
}

const CreateCategoryTest = {
    name: 'TestCategory',
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
    cat_id: '66224d85930b03e1d408f6b5'
}

const UpdateCategorieTest = {
    name: 'Testedcategory',
    img_url: 'https://www.effiliation.com/wp-content/uploads/2018/10/test.png'
    
}

const AlreadyExists = {
    name: 'TestProduct99',
    qtd: 100,
    cat_id: '66224d85930b03e1d408f6b5'
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
                url: '/products/66224d35930b03e1d408f6b3'
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
                url: '/categories/66224d85930b03e1d408f6b5'
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
                url: '/categories/66224d85930b03e1d408f6b5/products'
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
                url: '/categories/66224d85930b03e1d408f6b5',
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

            let invalidJwtToken = jwtToken.replace("e", "")

            const response = await app.inject({
                method: 'PUT',
                url: '/categories/66224d85930b03e1d408f6b5',
                body: UpdateCategorieTest,
                headers: {
                    'x-access-token': invalidJwtToken
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
                    'x-access-token': jwtToken
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
                body: CreateCategoryTest,
                headers: {
                    'x-access-token': jwtToken
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
                url: '/categories/66224d85930b03e1d408f6b5',
                body: UpdateCategorieTest,
                headers: {
                    'x-access-token': jwtToken
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
                url: '/categories/66224d85930b03e1d408f6b5',
                headers: {
                    'x-access-token': jwtToken
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
                    'x-access-token': jwtToken
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
                url: '/products/66224d35930b03e1d408f6b3',
                body: UpdateProductTest,
                headers: {
                    'x-access-token': jwtToken
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
                url: '/products/66224d35930b03e1d408f6b3',
                headers: {
                    'x-access-token': jwtToken
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
                    'x-access-token': jwtToken
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
                    'x-access-token': jwtToken,
                    'admin-token': adminToken
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
            equal(response.statusCode, 200);
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
            equal(response.statusCode, 200);
        })
    })
})