let db = require("./db");

module.exports = function(io){
	io.on("connection",function(socket){
		console.log(socket.id,"vua ket noi");
		socket.on("client-register-request",function(data){
			if(db.findIndex(elm => elm.username === data) !== -1) 
				socket.emit("server-register-failed")
			else {
				let o = {};
				o.username = data;
				o.id = socket.id;
				o.isTyping = false;
				db.push(o);
				socket.broadcast.emit("server-update-list",db);
				socket.emit("server-register-success",db);
			}
		});

		socket.on("client-is-registered",function(callback){
			let rs = db.findIndex(elm => elm.id ===socket.id) > -1;
			callback(rs);
		});
		socket.on("client-logout",function(){
			let index = db.findIndex(elm => elm.id ===socket.id);
			db.splice(index,1);
			socket.broadcast.emit("server-update-list",db);
		});
		socket.on("client-send-message-all",function(data,name){
			io.emit("server-send-message-all",data,name);
		});
		socket.on("client-focusing",function(name){
			db = db.map(elm => {
				if(elm.username === name) elm.isTyping = true;
				return elm;
			});
			socket.broadcast.emit("server-update-typing",db);
		});
		socket.on("client-stop-focusing",function(name){
			db = db.map(elm => {
				if(elm.username === name) elm.isTyping = false;
				return elm;
			});
			socket.broadcast.emit("server-update-typing",db);
		});
		socket.on("disconnect",function(){
			let index = db.findIndex(elm => elm.id ===socket.id);
			db.splice(index,1);
			socket.broadcast.emit("server-update-list",db);
			socket.broadcast.emit("server-update-typing",db);
		});
	});
};