import {expect} from "chai";
import mongoose from "mongoose";
import { URI } from "../src/config/index.js";
import ProductsManager from "../src/dao/ProductMongo.manager.js";


mongoose.connect(URI)

describe('Test con chai de user dao', ()=>{
    before(function() {
        this.productDao = new ProductsManager()
    })
    beforeEach(function(){
        mongoose.connection.collections.products.drop()
        this.timeout(5000)
    })
    it('El Dao debe tener lo productos en formato arreglo', async function(){
        
        const result = await this.productDao.getAll()
        expect(result).to.be.deep.equal([])
    })
})