//Referencias HTML
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");
const socket = io();

//Escuchamos el connect, ponemos el btnCrear en disabled false
socket.on('connect', () => {
	btnCrear.disabled = false;
});

//Escuchamos el disconnect, ponemos el btnCrear en disabled true
socket.on('disconnect', () => {
	btnCrear.disabled = true;
});

//Cuando se recarga la pagina escuchamos ultimo-ticket, le asignamos a lblNuevoTicket el valor del ticket que acabamos de crear
socket.on("ultimo-ticket", (ultimo) => {
	lblNuevoTicket.innerText = `Ticket ${ultimo}`;
});

//Escuchamos el click de btnCrear y emitimos siguiente-ticket, le asignamos a lblNuevoTicket el valor del ticket que acabamos de crear
btnCrear.addEventListener('click', () => {
	socket.emit('siguiente-ticket', null, (ticket) => {
		lblNuevoTicket.innerText = ticket;
	});
});