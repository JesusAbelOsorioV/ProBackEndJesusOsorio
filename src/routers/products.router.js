import { Router } from 'express'
import ProductManager from '../dao/ProductManager.js';
const router = Router();
import { json } from 'express';

const productjson = '../Products.json'
const productManager = new ProductManager(productjson);
const PStatus = true

router.use(json());

router.get('/products', async (req, res) => {
    const product = productManager.getProducts()
    const limit = parseInt(req.query.limit);
    
    try{
    if(!isNaN(limit) && limit > 0){
        const limitedProducts = product.slice(0, limit);
        res.status(200).json(limitedProducts);
    }else{
        res.status(200).json(product);
        // console.log('productos',product);
    }
    } catch(error){
        res.status(404).send({ error: `${error}`})
    }
});

router.get('/products/:pid', async (req, res) => {
    const {pid} = req.params;
    const product = await productManager.getProductsById(pid);
      if(product){
       res.json(product);
       console.log(product)
      }else{
        res.json({ error: 'Producto no encontrado'})
      }
  });

router.post('/products', async (req, res) =>{
    const products = productManager.getProducts();
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
        
        return res.send({status: 'error', error: 'Todos los campos son requeridos'});
    }
    
    const newProduct = {
        title,
        description,
        price,
        status: PStatus,
        thumbnail,
        code,
        stock,
    }
    if (products.find((productManager) => productManager.code === code)) 
        return res.send({status: 'error', error: `ya existe un producto con el code: ${code}`});
    const productsaved = [...products, newProduct];
    productManager.saveJson(productsaved);
    res.status(201).send(newProduct);
});

router.put('/products/:pid', async (res , req) =>{
    const pid = req.params;
    const updateP = req.body;

    if(!pid || !updateP){
        return res.status(400).json({error: "no se pudo actualizar"})
    }else{
        productManager.updateProducts(pid, updateP);
        res.json(`El producto con el id:${pid} se ha actualizado`)
    }
});

router.delete('/products/:pid', async (res, rep) => {
    const pid = rep.params;
    const delateP = await productManager.deleteProduct(pid);
    res.json(delateP);
});


export default router;