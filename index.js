const express = require("express");
const app = express();
const sv = require("http").Server(app);
const io = require("socket.io")(sv);
const path = require("path");
const ioCtr = require("./socket.index");

let port = process.env.PORT || 80;

sv.listen(port, () => console.log("sv listen on port",port));

app.set("view engine","pug");
app.set("views",path.join(__dirname,"/./views"));

app.use("/publics",express.static(path.join(__dirname,"publics")));

app.get("/",function(req,res){
	res.render("Index");
});

ioCtr(io);