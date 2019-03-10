var http = require('http');
var fs = require('fs');

console.log("serving on 9615");

http.createServer(function (req, res) {
	var path = req.url;
	if (path === "/") { path = "test/test.html" }
	else if (path[0] === "/") { path = path.slice(1, path.length); }
	console.log("serving "+path)
	try {
		var file = fs.readFileSync(path);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(file);
	} catch (e) {
		console.log(e);
	}
}).listen(9615);
