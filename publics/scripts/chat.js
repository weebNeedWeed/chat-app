$(function(){
	$("#chatForm").hide();

	const socket = io();
	socket.on("connect",function(){
		let name;
		$("#btn").click(function(){
			if(($("#name").val()).match(/[\d\w\S]+/)){
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
		let click = false;
		let one = "";
		let privateChat = function(){
			$(".user").click(function(){
				if(!click && one === ""){
					$(this).css("color","red");
					one = $(this).data("id");
					click = true;
				}else if(click && one !== $(this).data("id")){
					$("#list").find(`[data-id='${$(this).data("id")}']`).css("color","red");
					$("#list").find(`[data-id='${one}']`).css("color","black");
					one = $(this).data("id");
				}else if(click && one == $(this).data("id")){
					$("#list").find(`[data-id='${$(this).data("id")}']`).css("color","black");
					one = "";
					click = false;
				}
			});
		};

		$("#send").click(function(){
			let msg = $("#msgtxt").val();
			if(msg){
				if(!click){
					socket.emit("client-send-message",msg,name);
				}else{
					socket.emit("client-send-message-to",name,one,msg);
					let to =  $("#list").find(`[data-id='${one}']`).text();
					let mes = `<div class = "ms">you -> ${to}: ${msg}</div>`;
					$("#message").append(mes).scrollTop($("#message").outerHeight());
				}
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
			$("#message").append(msg).scrollTop($("#message").outerHeight());
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
			privateChat();
		});
		socket.on("server-update-list",function(data){
			if(data.findIndex(elm => elm.id === one) === -1){
				click = false;
				one = "";
			} 
			data.splice(data.findIndex(elm => elm.username === name),1);
			$("#list").html("");
			$("#list").append(data.map(elm => `<div class = 'user' data-id = '${elm.id}'>${elm.username}</div>`));
			privateChat();
		});
		socket.on("server-update-typing",function(data){
			let typing = data.map(elm => `<div class ="typing">${elm} is typing<div>`);
			$("#istyping").html("");
			$("#istyping").append(typing);
		});
		socket.on("server-send-message-to",function(name,data){
			let msg = `<div class = "ms">${name} -> you : ${data}</div>`;
			$("#message").append(msg).scrollTop($("#message").outerHeight());
		});
	});

});