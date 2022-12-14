//Externo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//Interno
import data from '../db/data.json' assert {type: 'json'};

class Ticket {
	constructor(numero, escritorio) {
		this.numero = numero;
		this.escritorio = escritorio;
	}
}

class TicketControl {
	//En el constructor establecemos los valores por defualt que van a tener el TicketControl
	constructor() {
		this.ultimo = 0;
		this.hoy = new Date().getDate();
		this.tickets = [];
		this.ultimos4 = [];
		this.init();
	}

	init() {
		//chequeamos si el dia que viene en "hoy" del json corresponde al dia de hoy realmente, si corresponde pasa si no ejecuta guardaDB que lo que hace es poner el json con los valores por defecto
		if (data.hoy === this.hoy) {
			this.tickets = data.tickets;
			this.ultimo = data.ultimo;
			this.ultimos4 = data.ultimos4
		} else {
			this.guardarDB();
		}
	}

	//Retornamos las propiedades con los valores por default, con este getter serializamos la data para pasrla al json
	get toJson() {
		return {
			ultimo: this.ultimo,
			hoy: this.hoy,
			tickets: this.tickets,
			ultimos4: this.ultimos4
		}
	}

	//Guardamos los cambios en la base de datos
	guardarDB() {
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const dbPath = path.join(__dirname, '../db/data.json');
		fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
	}

	//Asignamos el siguiente ticket
	siguiente() {
		this.ultimo += 1; //Genera un nuevo numero
		const ticket = new Ticket(this.ultimo, null); //Creamos un nuevo ticket
		this.tickets.push(ticket); //Añadimos el ticket al array de tickets
		this.guardarDB(); //Lo guardamos en el json
		return `Ticket ${ticket.numero}`; //Retornamos el ticket
	}

	//Atendemos un ticket
	atenderTicket(escritorio) {
		//Si el array de tickets esta vacio tiramos un null
		if (this.tickets.length === 0) {
			return null;
		}

		const ticket = this.tickets.shift(); //Eliminamos el primer elemento del array de tickets y lo retornamos
		ticket.escritorio = escritorio;
		this.ultimos4.unshift(ticket); //Añadimos el ticket como primer elemento del array ultimos4

		//Si el array ultimos4 tiene mas de 4 items removemos el ultimo
		if (this.ultimos4.length > 4) {
			this.ultimos4.splice(-1, 1); //removemos el ultimo elemento del array con el -1
		}

		this.guardarDB();
		return ticket;
	}
}

export {
	Ticket,
	TicketControl
}