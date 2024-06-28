import ProductsManager from "../dao/ProductMongo.manager.js";
import CartsManager from "../dao/CartMongo.manager.js";
import ChatManager from "../dao/chatMongo.manager.js";

export const productService = new ProductsManager()
export const cartService = new CartsManager()
export const chatService = new ChatManager()