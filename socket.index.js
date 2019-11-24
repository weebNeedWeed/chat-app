const emitCtr = require("./controllers/emit.controller");
const onCtr = require("./controllers/on.controller");

module.exports = function(io){
	io.on("connection",function(socket){
		console.log(socket.id,"da ket noi");
	});
};