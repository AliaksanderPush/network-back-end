const EVENTS = {
	connection: 'connection',
	CLIENT: {
		CREATE_CHAT_ROOM: 'CREATE_ROOM',
		SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
		JOIN_ROOM: 'JOIN_ROOM',
	},
	SERVER: {
		ROOM: 'ROOM',
		ROOMS: 'ROOMS',
		JOINED_ROOM: 'JOINED_ROOM',
		ROOM_MESSAGES: 'ROOM_MESSAGES',
	},
};

export default EVENTS;
