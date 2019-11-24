$(function(){
	$("#chatForm").hide();

	const socket = io();
	socket.on("connect",function(){
		let name;
		$("#btn").click(function(){
			if($("#name").val()){
				name = $("#name").val();
				socket.emit("client-register-request",name);
			}
			else alert("dk that bai ( chua nhap ten)");
		});

		$("#logout").click(function(){
			socket.emit("client-is-registered",function(data){
				if(data){ 
					socket.emit("client-logout");
					$("#register").show(1000);
					$("#chatForm").hide(2000);
					$("#message").html("");
				}
				else alert("ban hien khong the logout");
			});
		});

		$("#send").click(function(){
			let msg = $("#msgtxt").val();
			if(msg){
				socket.emit("client-send-message-all",msg,name);
			}else alert("vui long nhap tin nhan");
			$("#msgtxt").val("");
		});

		$("#msgtxt").focusin(function(){
			socket.emit("client-focusing",name);
		});
		$("#msgtxt").focusout(function(){
			socket.emit("client-stop-focusing",name);
		});

		socket.on("server-send-message-all",function(data,name){
			let msg = `<div class = "ms">${name}: ${data}</div>`;
			$("#message").append(msg);
		});
		socket.on("server-register-failed",function(){
			alert("that bai do trung ten");
		});
		socket.on("server-register-success",function(data){
			data.splice(data.findIndex(elm => elm.username === name),1);
			$("#list").html("");
			$("#list").append(data.map(elm => `<div class = 'user' data-id = '${elm.id}'>${elm.username}</div>`));
			$("#usname").html(name);
			$("#chatForm").show(2000);
			$("#register").hide(1000);
		});
		socket.on("server-update-list",function(data){
			data.splice(data.findIndex(elm => elm.username === name),1);
			$("#list").html("");
			$("#list").append(data.map(elm => `<div class = 'user' data-id = '${elm.id}'>${elm.username}</div>`));
			let typing = data.filter(elm => elm.isTyping).map(elm => `<div class ="typing">${elm.username} is typing<div>`);
			$("#istyping").html("");
			$("#istyping").append(typing);
		});
	});

});