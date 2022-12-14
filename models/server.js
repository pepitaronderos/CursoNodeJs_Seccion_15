//Externo
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

//Interno
import { socketController } from '../sockets/controller.js';

class ServerConfig {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app); //Creamos el server y le pasamos de parametro la aplicacion de express, con esto estamos levantando sockets y express todo junto
		this.io = new Server(this.server); // Socket.io le pasamos de parametro el server y terminamos de levantar sockets
		this.middlewares();
		this.sockets(); //Levanta los sockets del lado del server
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.static("public"));
	}

	//Los sockets permiten mantener una comunicacion activa/activa entre la computadora del cliente y el servidor, sirve para avisar de cambios y actualizaciones entre ambos, permitiendo que esta comunicacion sea en tiempo real
	sockets() {
		this.io.on('connection', socketController);
	}

	listen() {
		//Llamamos al server y no a app, para levantar sockets y express juntos
		this.server.listen(this.port, () => {
			console.log(`Example app listening on port ${this.port}`);
		});
	}
}

export {
	ServerConfig
}