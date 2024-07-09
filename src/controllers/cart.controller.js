import { cartService, productService, ticketService} from "../service/service.js";
class CartController {
    constructor(){
        this.cartService = cartService;
        this.productService = productService;
        this.ticketService = ticketService
    }
        getCarts = async (req, res) =>{
            const carts = await cartService.getCart()
            res.status(200).json(carts);
        }
        getCart = async (req, res) =>{
            const {cid} = req.params;
            const carts = await cartService.getCartBy(cid);
            res.status(200).json(carts);
        }
        createCart = async (req, res) =>{
            const {body} = req;
            const carts = await cartService.createCart(body);
            res.status(201).json(carts);
        }
        uptdateCart = async (req, res) =>{
            const {cid, pid} = req.params;
            const carts = await cartService.createCart(cid, pid);
            res.status(201).json(carts);
        }
        deleteProductFromCart = async (req, res) =>{
            const {cid, pid} = req.params;
            await cartService.deleteProductCart(cid, pid);
            res.status(204).end();
        }
        deleteCart = async (req, res) =>{
            const {cid} = req.params;
            await cartService.deleteCart(cid);
            res.status(204).end();
        }
        createUnCode = async () => {
            let unCode;
            let codeExists = true;
        
            while (codeExists) {
                unCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                const existingTicket = await this.ticketService({unCode});
                if (!existingTicket) {
                    codeExists = false;
                }
            }
        
            return unCode;
        };
        purchase = async (req, res)=>{
            const {cid} = req.params
            const user = req.user

            const cart = await cartService.getCartBy({_id: cid})
            if(!cart){
                throw new Error ('Carrito no encontrado')
            }

            const productProcess = []
            const productsSinProcesar = []
            let totalA = 0
            

        }
}

export default CartController