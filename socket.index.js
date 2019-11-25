let db = require("./db");
let istyping = require("./db.typing");
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
		socket.on("client-send-message",function(data,name){
			io.emit("server-send-message-all",data,name);
		});
		socket.on("client-send-message-to",function(name,toone,msg){
			socket.broadcast.to(toone).emit("server-send-message-to",name,msg);
		});
		socket.on("client-focusing",function(name){
			istyping.push(name);
			socket.broadcast.emit("server-update-typing",istyping);
		});
		socket.on("client-stop-focusing",function(name){
			istyping.splice(istyping.findIndex(elm => elm === name),1);
			socket.broadcast.emit("server-update-typing",istyping);
		});
		socket.on("disconnect",function(){
			let index = db.findIndex(elm => elm.id ===socket.id);
			db.splice(index,1);
			socket.broadcast.emit("server-update-list",db);
			socket.broadcast.emit("server-update-typing",db);
		});
	});
};