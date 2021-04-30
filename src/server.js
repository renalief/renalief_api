const Hapi = require('@hapi/hapi');
const routes = require('./routes');


const init = async () => {
	const server = Hapi.server({
		port: 5000,
		// host: 'localhost',	
		host: process.env.NODE_ENV !== 'production' ? 'localhost' : '172.31.32.28',
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});

	server.route(routes);

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};


init();
