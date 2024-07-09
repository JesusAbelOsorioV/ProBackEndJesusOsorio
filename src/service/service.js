import ProductsManager from "../dao/ProductMongo.manager.js";
import CartsManager from "../dao/CartMongo.manager.js";
import ChatManager from "../dao/chatMongo.manager.js";
import UserManager from "../dao/userMongo.manager.js";
import TicketsManager from "../dao/ticketMongo.manager.js";

export const productService = new ProductsManager()
export const cartService = new CartsManager()
export const chatService = new ChatManager()
export const userService = new UserManager()
export const ticketService = new TicketsManager()