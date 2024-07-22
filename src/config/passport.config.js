import passport from "passport";
import local from 'passport-local'
import UserManagerMongo from "../dao/userMongo.manager.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import GithubStrategy from 'passport-github2'
import { ExtractJwt, Strategy } from 'passport-jwt'
import CartsManager from "../dao/CartMongo.manager.js";
import { PRIVATE_KEY } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

const JWTStrategy = Strategy
const JWTExtract = ExtractJwt

const cookieExtractor = req =>{
    let token = null
    if(req && req.cookies) token = req.cookies['token']
}


const LocalStrategy = local.Strategy
const userService = new UserManagerMongo()
const cartService = new CartsManager()

export const initPassport = () =>{
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
         return done(null, jwt_payload)   
        } catch (error) {
            return done(error)
        }
    }))
    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true,
    //     usernameField: 'email'
    // }, async(req, username, password, done) => {
    //     const {first_name, last_name} = req.body
    //     try {
    //         let userFound = await userService.getUserBy({email: username})
    //         if(userFound) {
    //             console.log('el user ya existe')
    //             return done(null, false)
    //         }
    //         let newUser ={
    //             first_name,
    //             last_name,
    //             email: username,
    //             password: createHash(password)
    //         }
    //         let result = await userService.createUser(newUser)
    //         return done(null, result)
    //     } catch (error) {
    //         return done('error al registar el usuario' +error)
    //     }
    // }))

    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async(username, password, done) =>{
    //     try {
    //         const user = await userService.getUserBy({email: username})
    //         if (!user) {
    //            console.log('usuario no encontrado')
    //            return done(null, false) 
    //         }
    //         if (!isValidPassword(password, user)) 
    //         return done(null, user)
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

    passport.use('github', new GithubStrategy({
        clientID:'Iv23liCm5PPynrw04h4x',
        clientSecret:'9fc56bbbf615789bee7649fbd51142f76abed1da',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=>{
        try {
            logger.info(profile)
            let user = await userService.getUserBy({email: profile._json.email})
            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }
                let result = await userService.createUser(newUser)
                done(null, result) 
            }else{
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done)=>{
        try {
            let user = await userService.getUserBy({_id: id})
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}