const EVENTS = {
	connection: 'connection',
	CLIENT: {
		CREATE_CHAT_ROOM: 'CREATE_ROOM',
		JOIN_ROOM: 'JOIN_ROOM',
	},
	SERVER: {
		ROOM: 'ROOM',
		ROOMS: 'ROOMS',
		JOINED_ROOM: 'JOINED_ROOM',
		ROOM_MESSAGES: 'ROOM_MESSAGES',
		SEND_MESSAGE: 'SEND_ROOM_MESSAGE',
	},
};

export default EVENTS;