//Interno
import { TicketControl } from "../models/index.js";

//Instanciamos la clase ticketcontrol
const ticketControl = new TicketControl();

const socketController = socket => {
	//Emitimos ultimo-ticket y le pasamos el valor que viene de ultimo
	socket.emit("ultimo-ticket", ticketControl.ultimo);
	//Emitimos estado-actual y le pasamos el valor que viene de ultimos4
	socket.emit("estado-actual", ticketControl.ultimos4);
	//Emitimos tickets-pendientes" y le pasamos cuantos ticket quedan en el array
	socket.emit("tickets-pendientes", ticketControl.tickets.length);

	//Escuchamos siguiente-ticket
	socket.on("siguiente-ticket", (payload, callback) => {
		const siguiente = ticketControl.siguiente(); //guardamos el valor que nos retorna siguiente
		callback(siguiente); //pasamos el valor de siguiente al callback
		socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length); //Emitimos tickets-pendientes para actualizar el valor
	});

	//Escuchamos atender-ticket
	socket.on("atender-ticket", ({ escritorio }, callback) => {
		//Si escritorio no tiene valor, retornamos el callback con el soguiente objeto
		if (!escritorio) {
			return callback({
				ok: false,
				msg: "El Escritorio es obligatorio"
			});
		}

		//A atenderTicket le pasamos el escritorio
		const ticket = ticketControl.atenderTicket(escritorio);
		//Emitimos estado-actual con el valor de los ultimos4
		socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
		//Emitimos tickets-pendientes con la cantidad de ticket que hay en el array
		socket.emit("tickets-pendientes", ticketControl.tickets.length);
		//Emitimos tickets-pendientes con la cantidad de ticket que hay en el array para todos
		socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

		//Si ticket no tiene valor, entonces retornamos el callback con el siguiente objeto y si no retornamos el otro objeto con el ticket
		if (!ticket) {
			return callback({
				ok: false,
				msg: "Ya no hay tickets pendientes"
			});
		} else {
			return callback({
				ok: true,
				ticket
			});
		}
	});
}

export {
	socketController
}