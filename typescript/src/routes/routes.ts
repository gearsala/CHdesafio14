import { Router, Request, Response } from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import Product from '../classes/productClass';
import Message from '../classes/messageClass';

export const router = Router();
const products = new Product();
const messages = new Message();

router.get('/productos/listar', (req: Request, res: Response) => {
	const getProducts = products.getProducts();
	getProducts.length !== 0
		? res.json({ products: getProducts })
		: res.status(404).json({ error: 'No hay productos cargados' });
});

router.get('/mensajes/listar', async (req: Request, res: Response) => {
	try {
		const listMessages = await messages.getMessages();
		listMessages.length !== 0
			? res.json({ messages: listMessages })
			: res.status(404).json({ error: 'No hay mensajes cargados' });
	} catch (error) {
		console.log(error);
	}
});

router.get('/productos/listar/:id', (req: Request, res: Response) => {
	const specificId = req.params.id;
	const getProducts = products.getProducts();
	const product = getProducts.find((product) => product.id == specificId);
	product
		? res.json({ product })
		: res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/productos/guardar', (req: Request, res: Response) => {
	const body = req.body;
	const product = products.addProduct(body.title, body.price, body.thumbnail);
	res.json({ product });
});

router.post('/mensajes/guardar', async (req: Request, res: Response) => {
	try {
		const body = req.body;
		await messages.newMessage(body.email, body.date, body.time, body.message);
		res.json({ mensaje: body });
	} catch (error) {
		console.log(error);
	}
});

router.put('/productos/actualizar/:id', (req: Request, res: Response) => {
	const specificId = req.params.id;
	const body = req.body;
	const updatedProduct = products.updateProduct(
		specificId,
		body.title,
		body.price,
		body.thumbnail
	);
	updatedProduct === -1
		? res.status(404).json({ error: 'Producto no encontrado' })
		: res.status(201).json({ product: updatedProduct });
});

router.delete('/productos/borrar/:id', (req: Request, res: Response) => {
	const specificId = req.params.id;
	const deletedProduct = products.deleteProduct(specificId);
	deletedProduct === -1
		? res.status(404).json({ error: 'Producto no encontrado o ya eliminado' })
		: res.json({ deletedProduct });
});

export const ioServer = (server: http.Server) => {
	const io = new Server(server);
	io.on('connection', async (socket) => {
		console.log('Client Connected');

		socket.on('addProduct', (data) => {
			products.addProduct(data.title, data.price, data.thumbnail);
			io.emit('products', products.getProducts());
		});

		socket.emit('products', products.getProducts());

		try {
			const getMessages = await messages.getMessages();
			socket.on('sendMessage', async (message) => {
				try {
					await messages.newMessage(
						message.email,
						message.date,
						message.time,
						message.message
					);
				} catch (error) {
					console.log(error);
				}
				io.emit('messages', getMessages);
			});

			socket.emit('messages', getMessages);
		} catch (error) {
			console.log(error);
		}
	});

	return io;
};