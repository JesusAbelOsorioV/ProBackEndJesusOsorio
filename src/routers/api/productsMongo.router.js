import { Router } from "express";
import ProductController from "../../controllers/products.controller.js";
import passportCall from "../../middlewares/passportCall.middlewares.js";
import authorization from "../../middlewares/authorization.middleware.js";

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
router.post('/products', passportCall('jwt'), authorization('admin','premium'), createProducts);
router.put('/products/:id',passportCall('jwt'), authorization('admin','premium'), updateProducts);
router.delete('/products/:pid',passportCall('jwt'), authorization('admin','premium'), delateProducts);

export default router;