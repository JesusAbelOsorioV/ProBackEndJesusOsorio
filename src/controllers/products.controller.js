import { productService } from "../service/service.js";
class ProductController {
    constructor(){
        this.productService = productService
    }
        getProducts = async (req, res) => {
        try {
           const {products} = await productService.getProducts();
            res.status(200).json(products) 
        } catch (error) {
           console.log(error) 
        }
            
        }
        getProduct = async (req, res) =>{
            const {pid} = req.params;
            const products = await productService.getProductById(pid)
            res.status(200).json(products);
        }
        createProducts = async (req, res) =>{
            const {body} = req;
            const products = await productService.createProduct(body);
            res.status(201).json(products);
        }
        updateProducts = async (req, res) =>{
            const {pid} = req.params;
            const {body} = req;
            await productService.updateProductById(pid, body);
            res.status(204).end()
        }
        delateProducts =async (req, res) =>{
            const {pid} = req.params;
            const user = req.user;
            try {
                const productFound = await productService.getProductById({_id: pid})
                if(!productFound) return res.status(400).send({ status: 'error', error: `No exixte ningun producto con Id:${pid}`})
                    if (user.role === 'premium' && productFound.owner !== user.email) return res.status(401).send({ status: 'error', error: `el producto ${productFound.title} no pertenece a ${user.email}, y no puede eliminarlo` });

                await productService.delateProductById(pid);
                res.status(200).send({ status: 'success', payload: productFound });
    
            } catch (error) {
                res.status(500).send({ status: 'error', error: `Error al borrar el producto: ${error.message}` });
            }
        }
}
export default ProductController