import { Server, Socket } from 'socket.io';
import socket from 'socket.io';

export function sockets(io: socket.Server) {
	io.on('connection', (socket: any) => {
		console.log('a user Connecterd!!!', socket.id);
	});
}
