import { Router } from "express";
import ProductController from "../../controllers/products.controller.js";

const router = Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

router.get('/products', getProducts);
router.get('/products/:pid', getProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:pid', deleteProduct);

export default router;