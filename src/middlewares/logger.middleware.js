import { logger } from "../utils/logger.js";

export const loggerMidw = (req, res, next) =>{
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()  
}