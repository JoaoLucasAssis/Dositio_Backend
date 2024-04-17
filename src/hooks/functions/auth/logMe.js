export const logMe = (app) => async (req, rep) => {
    req.log.info(`Request for url: ${req.url}.`)
}