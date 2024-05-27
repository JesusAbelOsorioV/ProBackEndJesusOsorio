import {connect} from 'mongoose'

export const URI = 'mongodb+srv://abelosorio2001:abel20@clustera.cqyrcmz.mongodb.net/';

 const connectDB = async () =>{
    try {
        await connect(URI);
        console.log('DB Conected')
    } catch (error) {
        console.error('Erorr to connect to DB', error.message);
    }
}

export default connectDB;


// const connectDB = () =>{
//     connect('mongodb+srv://abelosorio2001:abel20@clustera.cqyrcmz.mongodb.net/')
//     console.log('DB Conected');
// }

// export default connectDB;