import createError from '@fastify/error'

export const AUTH_NO_TOKEN = createError('AUTH_NO_TOKEN', 'x-access-token is missing', 401)
export const AUTH_INVALID_TOKEN = createError('AUTH_INVALID_TOKEN', 'The token provided is invalid', 401)

export const AUTH_NO_ADMIN_TOKEN = createError('AUTH_NO_ADMIN_TOKEN', 'admin-token is missing', 401)
export const AUTH_INVALID_ADMIN_TOKEN = createError('AUTH_INVALID_ADMIN_TOKEN', 'The admin-token provided is invalid', 401)

export const NOT_FOUND = createError('NOT_FOUND', 'The requested resource could not be found', 404)
export const ALREADY_EXISTS = createError('ALREADY_EXISTS', 'This resource already exists in database', 412)

export const USER_NOT_FOUND = createError('USER_NOT_FOUND', 'The user is not registered', 400)
export const USER_NOT_ADMIN = createError('USER_NOT_ADMIN', 'The user is not admin', 403)