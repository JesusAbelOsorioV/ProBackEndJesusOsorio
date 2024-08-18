import ProductManager from "../src/dao/ProductMongo.manager.js";
import Asserts from 'assert'
import mongoose from "mongoose";
import { URI } from "../src/config/index.js";
import { it } from "mocha";

mongoose.connect(URI)
const assert = Asserts.strict

describe('Test Products Dao', function(){
    before(function() {
        this.productDao = new ProductManager()
    })
    beforeEach(function(){
        mongoose.connection.collections.products.drop()
        this.timeout(5000)
    })
    it('El Dao debe tener lo productos en formato arreglo', async function(){
        console.log(this.productDao)
        const result = await this.productDao.getAll()
        assert.strictEqual(Array.isArray(result), true)
    })
    it('El dao debe agregar un producto correctamente a la base de datos', async function() {
        let mockProduct = {
        title: 'producto prueba 1',
		description: 'Este es un producto prueba1',
		price: 500,
		thumbnail: 'sin imagen',
		code: 'asd1231',
		stock: 12
        }

        const result = await this.productDao.createProduct(mockProduct)
        assert.ok(result._id)
    })
    it('El dao puede obtener a un producto por ID', async function(){
        let mockProduct = {
            title: 'producto prueba 1',
            description: 'Este es un producto prueba1',
            price: 500,
            thumbnail: 'sin imagen',
            code: 'asd1231',
            stock: 12
            }

            const result = await this.productDao.createProduct(mockProduct)
            const product = await this.productDao.getProductById({_id: result.id})

            assert.strict(typeof product, 'object')
    })
})
