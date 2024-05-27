import {connect} from 'mongoose'

const connectDB = () =>{
    connect('mongodb+srv://abelosorio2001:abel20@clustera.cqyrcmz.mongodb.net/')
    console.log('DB Conected');
}

export default connectDB;