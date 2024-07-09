import {connect} from 'mongoose'
import dotenv from 'dotenv'
import { program } from '../utils/commander.js'

const { mode } = program.opts()
dotenv.config({
    path: mode === 'production' ? './.env' : './.env.development'
})

export const objectConfig = {
    port: process.env.PORT || 300,
    mongo_url : process.env.MONGO_URL,
    jwt_private_key: process.env.JWT_PRIVATE_KEY,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS
}
export const URI = process.env.MONGO_URL
// export const URI = 'mongodb+srv://abelosorio2001:abel20@clustera.cqyrcmz.mongodb.net/';

 const connectDB = async () =>{
    try {
        await connect(URI);
        console.log('DB Conected')
    } catch (error) {
        console.error('Erorr to connect to DB', error.message);
    }
}

export default connectDB;
