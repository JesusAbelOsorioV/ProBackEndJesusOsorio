import { Router } from "express";
import ProductController from "../../controllers/products.controller.js";

const router = Router();
const {
    getProducts,
    getProduct,
    createProducts,
    updateProducts,
    delateProducts
} = new ProductController()

router.get('/products', getProducts);
router.get('/products/:pid', getProduct);
router.post('/products', createProducts);
router.put('/products/:id', updateProducts);
router.delete('/products/:pid', delateProducts);

export default router;