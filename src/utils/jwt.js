import jwt from 'jsonwebtoken'

export const PRIVATE_KEY = 'key-secret-jwt'

export const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})