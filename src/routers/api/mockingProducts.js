import { Router } from "express";
import MockingProductController from "../../controllers/mockingproducts.controller.js";

const router = Router();
const {
    getMokingProducts,
    createMokingProducts
} = new MockingProductController()

router.get('/products', getMokingProducts);
router.post('/products', createMokingProducts);

export default router;