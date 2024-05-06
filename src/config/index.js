import {connect} from 'mongoose'

const connectDB = () =>{
    connect('mongodb://localhost:27017/ecommersJO')
    console.log('DB Conected');
}

export default connectDB;