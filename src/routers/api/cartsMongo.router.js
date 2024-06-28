import { Router } from "express";
import CartController from "../../controllers/cart.controller.js";

const router = Router();
const {
    getCarts,
    getCart,
    createCart,
    uptdateCart,
    deleteProductFromCart,
    deleteCart
} = new CartController()

router.get('/carts', getCarts);
router.get('/carts/:cid', getCart);
router.post('/carts', createCart);
router.put('/carts/:cid/products/pid', uptdateCart);
router.delete('/carts/:cid/products/pid', deleteProductFromCart)
router.delete('/carts/:cid/', deleteCart)

export default router;