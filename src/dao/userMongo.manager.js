import { userModel } from "../models/users.model.js";

export default class UserManagerMongo{
    constructor(){
        this.userModel = userModel;
    }

    async getUsers(){
        return await userModel.find();
    }

    async createUser(user){
        return await this.userModel.create(user);
    }

    async getUserBy(filter){
        return this.userModel.findOne(filter);
    }

    async getUserByEmail(email){
        return this.userModel.find((user) => user.email === email);
    }
    async updateUser(uid, updateUser){
        return this.userModel.updateOne(uid, {$set: updateUser})
    }
}