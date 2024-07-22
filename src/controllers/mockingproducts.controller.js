import { productService } from "../service/service.js";
import generateMockProducts from "../utils/generateMockProducts.js";
import { logger } from "../utils/logger.js";
class MockingProductController {
    constructor(){
        this.productService = productService
    }

    getMockingProducts = async (req, res) => {
        try {
            let products = []
            for (let i = 0; i <50; i++){
                products.push(generateMockProducts())
            }
            res.send({status:'success', payload:products}) 
        } catch (error) {
           logger.error(error) 
        }
    
        // getMockingProducts = async (req, res) => {
        // try {
        //    const {products} = await productService.getProducts();
        //     res.status(200).json(products) 
        // } catch (error) {
        //    console.log(error) 
        // }
            
        }
        
        createMockingProducts = async (req, res, next) =>{
            const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
            try {
                if (!title || !description || !code || !price || !stock || !category) {
                    CustomError.createError({
                        name: 'Error al crear el producto',
                        cause: generateInvalidProductError({ title, description, code, price, stock, category }),
                        message: 'Error al crear el producto, campos faltantes o inválidos',
                        code: EError.INVALID_TYPRE_ERROR
                    });
                }
            const products = await productService.createProduct(body);
            res.status(201).json(products);  
            } catch (error) {
              next(error)  
            }
            
        }
        
}
export default MockingProductController