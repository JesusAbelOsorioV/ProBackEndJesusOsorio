import { productService } from "../service/service.js";
class ProductController {
    constructor(){
        this.productService = productService
    }
    getProducts = async (req, res) => {
            const {products} = await productService.getProducts();
            res.status(200).json(products)
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
            await productService.delateProductById(pid);
            res.status(204).end();
        }
}
export default ProductController