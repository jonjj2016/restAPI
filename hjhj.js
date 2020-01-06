const http = require('http');
const server = http.createServer((req, res) => {
	const todos = [
		{ id: 1, name: 'name' },
		{ id: 2, name: 'name' },
		{ id: 3, name: 'name' },
		{ id: 4, name: 'name' }
	];
	let body = [];
	req
		.on('data', (chunk) => {
			body.push(chunk);
		})
		.on('end', () => {
			body = Buffer.concat(body).toString();
			console.log(body);
		});
	res.writeHead(400, {
		'Content-Type' : 'application/json',
		'X-Powered-By' : 'Node.js'
	});

	res.end(
		JSON.stringify({
			stattus : 'Success',
			data    : todos
		})
	);
});
server.listen(4677, () => {
	console.log('server is running on port 4677');
});
