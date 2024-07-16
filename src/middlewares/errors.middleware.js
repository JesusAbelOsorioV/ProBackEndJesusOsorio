import { EError } from "../service/errors/enums.js";

export const handleErrors = (error, req, res, next) =>{
    console.log(error.cause)
    switch (error.code){
        case EError.INVALID_TYPRE_ERROR: 
            return res.send({ status: 'error', error: error.name})
            break
        case EError.DATABASE_ERROR:
            return res.send({ status: 'error', error: error.name})
            break
        default :
            return res.send({ status: 'error', error: 'errir no identificado'})
    }
}