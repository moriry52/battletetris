var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

// HTTP サーバのポートを指定する
port = process.env.PORT || 8080;
app.listen(port);
console.log ("port",port)

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}

io.on('connection', function (socket) {
	console.log("connection")
	var name;
	var battle_code;
	var mode;

	socket.on('call', function (data) {
		for (i in data) {
			mode = i;
			battle_code = i.substr(0, 5);
			for (j in data[i]) {
				name = j;
			}
			io.emit(i, data[i]);
		}
	});

	socket.on('disconnect', function (reason) {
		if (mode != undefined && reason === 'io client disconnect') {
			if (mode.slice(-4) == "join") {
				io.emit(battle_code + "join", { [name]: { users: 0 } })
			} else {
				io.emit(mode.substr(0, 17) + "action", { action: "end", died: true })
			}
		}
	})

});

