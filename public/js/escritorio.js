const searchParams = new URLSearchParams(window.location.search);
const escritorio = searchParams.get("escritorio");
const socket = io();

//Elementos HTML
const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

//Si searchParams no tiene el valor escritorio, entonces lo que hace es redirigir a al index y tirar un error
if (!searchParams.has("escritorio")) {
	window.location = "index.html";
	throw new Error("El escritorio es obligatorio"); //no pongo return porque no es una funcion y no tenemos nada para retornar
}

lblEscritorio.innerText = escritorio; //Le asignamos al elemento HTML el valor que viene en escritorio
divAlerta.style.display = "none"; //Por defualt ocultamos la alerta de que no hay mas tickets

//Escuchamos el connect, ponemeos el boton de atender el disabled false
socket.on('connect', () => {
	btnAtender.disabled = false;
});

//Escuchamos el disconnect, ponemos el boton de atender en disabled true
socket.on('disconnect', () => {
	btnAtender.disabled = true;
});

//Escuchamos tickets-pendientes, le cambiamos el texto al elemento HTML con el valor de los tickets sin atender
socket.on("tickets-pendientes", (payload) => {
	lblPendientes.innerText = payload;
});

//Cuando clickeamos en el boton atender emitimos atender-ticket
btnAtender.addEventListener('click', () => {
	//Pasamos de payload escritorio y de callback desestrucutramos el ok y el ticket
	socket.emit('atender-ticket', { escritorio }, ({ ok, ticket }) => {
		//Si el ok esta en false entonces lo que hacemos en pasarle al lblTicket el texto nadie, porque significa que no estamos atendiendo a nadie y ponemos el divAlerta en block
		if (!ok) {
			lblTicket.innerText = `Nadie`;
			return divAlerta.style.display = "block";
		}

		//Le pasamos a lblTicket el numero del ticket que acabamos de atender
		lblTicket.innerText = `Ticket ${ticket.numero}`;
	});
});
