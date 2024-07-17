import { Router } from "express";
import MockingProductController from "../../controllers/mockingproducts.controller.js";

const router = Router();
const {
    getMockingProducts,
    createMockingProducts
} = new MockingProductController()

router.get('/products', getMockingProducts);
router.post('/products', createMockingProducts);

export default router;