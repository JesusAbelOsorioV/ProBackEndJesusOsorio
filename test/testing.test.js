import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { objectConfig } from "../src/config/index.js";
import { logger } from "../src/utils/logger.js";
import ProductsManager from "../src/dao/ProductMongo.manager.js";
import CartManager from '../src/dao/CartMongo.manager.js'
import userManager from '../src/dao/userMongo.manager.js'

const { admin_email, admin_pass, mongo_url} = objectConfig

const requester = supertest('http://localhost:8080')
mongoose.connect(mongo_url)

const userMock = {
    first_name: 'firstName',
    last_name: 'lastName',
    email: 'user_test@email.com',
    password: '1234',
};

const adminLogin = {
    email: admin_email,
    password: admin_pass,
};

const productMock = {
    title: 'producto prueba 1',
	description: 'Este es un producto prueba1',
	price: 500,
	thumbnail: 'sin imagen',
	code: 'asd1231',
	stock: 12
};

describe('Test ecommerce Jesus Osorio', () => {

    describe('Test de products', () => {
        let productId;
        let cookie;

        before(async function () {
            this.productsDao = new ProductsManager();

        });

        beforeEach(async function () {

            const result = await requester.post('/api/sessions/login').send(adminLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            this.timeout(5000);
        });

        afterEach(async function () {
            if (productId) {
                try {
                    await this.productsDao.findOneAndDelete({ _id: pid });
                } catch (error) {
                    logger.error(`Error product borrado: ${error.message}`);
                }
            }
            await requester.post('/api/sessions/logout').send();
            pid = null;
            cookie = null;
            this.timeout(5000);
        });

        it('El endpoint POST /api/products debe crear un producto correctamente', async function () {

            const { statusCode, ok, body } = await requester.post('/api/products')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock);
            pid = body.payload._id;

            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('_id');
            expect(body.payload.title).to.be.equal(productMock.title);
            expect(body.payload.price).to.be.equal(productMock.price);
        });

        it('El endpoint GET /api/products debe mostrar todos los productos existentes', async function () {
            const { statusCode, ok, body } = await requester.get('/api/products');
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload.products).to.be.an('array');
        });

        it('El endpoint GET /api/products/:pid debe mostrar un producto existente', async function () {
            const responseProduct = await requester.post('/api/products')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock);

            pid = responseProduct.body.payload._id;
            const { statusCode, ok, body } = await requester.get(`/api/products/${pid}`);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('_id').equal(pid);
            expect(body.payload.title).to.be.equal(productMock.title);
        });
    });

    describe('Test de carts', () => {
        let cid;
        let pid;
        let cookie;

        before(async function () {
            this.productsDao = new ProductsManager();
            this.cartsDao = new CartManager();
            this.userDao = new userManager();
        });

        afterEach(async function () {
            if (cartId) {
                const foundUserMock = await userDao.findOne({ email: userMock.email });
                await cartsDao.findOneAndDelete({ _id: cid });
                await cartsDao.findOneAndDelete({ _id: foundUserMock.cart });
                await userDao.findOneAndDelete({ _id: foundUserMock._id });
            }
            if (productId) {
                await productsDao.findOneAndDelete({ _id: pid });
            }
            await requester.post('/api/sessions/logout').send();
            pid = null;
            cid = null;
            cookie = null;
            this.timeout(5000);
        });

        it('El endpoint POST /api/carts debe crear un carrito correctamente', async function () {
            const newUser = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            this.timeout(5000);

            const result = await requester.post('/api/sessions/login').send(userLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            this.timeout(5000);

            const { statusCode, ok, body } = await requester.post('/api/carts')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send();
            cid = body.payload._id;
            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('_id');
        });

        it('El endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito correctamente', async function () {
            const resultAdmin = await requester.post('/api/sessions/login').send(adminLogin);
            const cookieResultAdmin = resultAdmin.headers['set-cookie'][0];
            cookie = {
                name: cookieResultAdmin.split('=')[0],
                value: cookieResultAdmin.split('=')[1],
            };

            this.timeout(5000);

            const productResponse = await requester.post('/api/products')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock);

            pid = productResponse.body.payload._id;

            this.timeout(5000);

            await requester.post('/api/sessions/logout').send();
            cookie = null;
            this.timeout(5000);

            const newUser = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            this.timeout(5000);

            const result = await requester.post('/api/sessions/login').send(userLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            this.timeout(5000);

            const getMockUser = await userDao.findOne({ email: userMock.email });
            cid = getMockUser.cart;

            const { statusCode, ok, body } = await requester.post(`/api/carts/${cid}/products/${pid}`)
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send();
            
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload.payload).to.have.property('products').to.be.an('array');
        });

        it('El endpoint GET /api/carts/:cid debe mostrar un carrito existente', async function () {
            const newUser = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            const result = await requester.post('/api/sessions/login').send(userLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            const newCart = await requester.post('/api/carts')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send();
            cid = newCart.body.payload._id;

            const { statusCode, ok, body } = await requester.get(`/api/carts/${cid}`)
                .set('Cookie', `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body.payload).to.have.property('products').to.be.an('array');
        });
    });

    describe('Test de sessions', () => {
        let uid;
        let cid;
        let cookie;

        before(async function () {
            this.userDao = new userManager();
            this.cartsDao = new CartManager();
        });

        afterEach(async function () {
            if (uid) { await userDao.findOneAndDelete({ _id: uid }); }
            if (cid) { await cartsDao.findOneAndDelete({ _id: cid }); }
            await requester.post('/api/sessions/logout').send();
            uid = null;
            cookie = null;
            this.timeout(5000);
        });

        it('El endpoint POST /api/sessions/register debe registrar un usuario correctamente', async function () {
            const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(userMock);
            this.timeout(5000);

            const registeredUsedMock = await userDao.findOne({ email: userMock.email });
            uid = registeredUsedMock._id;
            cid = registeredUsedMock.cart;

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(registeredUsedMock).to.have.property('_id');
            expect(registeredUsedMock.email).to.be.equal(userMock.email);
        });

        it('El endpoint POST /api/sessions/login debe loguear correctamente a un usuario y devolver una cookie con un token', async function () {

            const { statusCode, ok, body } = await requester.post('/api/sessions/register').send(userMock);
            const userLogin = {
                email: userMock.email,
                password: userMock.password,
            };
            const result = await requester.post('/api/sessions/login').send(userLogin);

            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            const registeredUsedMock = await userDao.findOne({ email: userMock.email });
            uid = registeredUsedMock._id;
            cid = registeredUsedMock.cart;

            expect(cookieResult).to.be.ok;
            expect(cookie.name).to.be.ok.and.eql('token');
            expect(cookie.value).to.be.ok;
        });

        it('El endpoint GET /api/sessions/current debe ocultar datos que no pueden ver los usuarios con el rol "user"', async function () {

            const registerResponse = await requester.post('/api/sessions/register').send(userMock);
            const registeredUsedMock = await userDao.findOne({ email: userMock.email });
            userId = registeredUsedMock._id;
            cartId = registeredUsedMock.cart;


            const loginResponse = await requester.post('/api/sessions/login').send({
                email: userMock.email,
                password: userMock.password,
            });


            const cookieResult = loginResponse.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            const { statusCode, ok, body } = await requester.get('/api/sessions/current')
                .set('Cookie', `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body).to.have.property('payload').equal('user');
        });

        it('El endpoint GET /api/sessions/current debe mostrar datos a usuarios con el rol "admin"', async function () {

            const result = await requester.post('/api/sessions/login').send(adminLogin);
            const cookieResult = result.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };
            this.timeout(5000);

            const { statusCode, ok, body } = await requester.get('/api/sessions/current')
                .set('Cookie', `${cookie.name}=${cookie.value}`);

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(body).to.have.property('payload').equal('admin');
        });
    });
});