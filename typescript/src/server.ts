import express from 'express';
import * as http from 'http';
import { router, ioServer } from './routes/routes';

const port = process.env.PORT || 8080;
const app = express();
const server = new http.Server(app);

ioServer(server);


server.listen(port, () => {
	console.log(`Server running in port:  ${port}`);
});

server.on('error', (err) => {
	console.error(`There was an error: ${err}`);
});

app.set('json spaces', 2); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
	res.json({
		message: 'Hi, you are connected to the api',
	});
});

app.use('/api', router);