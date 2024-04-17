/** @type{import('fastify').FastifyPluginAsync<>} */
import { checkExistence, extractUser, logMe, isAdmin } from './functions/index.js'

export default async function onRouteHook(app, options) {
    app.addHook('onRoute', (routeOptions) => {
        // Inicialização
        routeOptions.onRequest = Array.isArray(routeOptions.onRequest) ? routeOptions.onRequest : []
        routeOptions.preHandler = Array.isArray(routeOptions.preHandler) ? routeOptions.preHandler : []

        // onRequest
        if (routeOptions.config?.logMe) {
            routeOptions.onRequest.push(logMe(app))
        }
        if (routeOptions.config?.requireAuthentication) {
            routeOptions.onRequest.push(extractUser(app))
        }
        if (routeOptions.config?.isAdmin) {
            routeOptions.onRequest.push(isAdmin(app))
        }

        // preHandler
        if (routeOptions.url === '/products' && routeOptions.method === 'POST') {
            routeOptions.preHandler.push(checkExistence(app))
        }
    });
}
