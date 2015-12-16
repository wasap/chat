var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var port = 8080;
 

var app = express();
    app.use(express.static(__dirname+ "/public/"));
    app.get('Get', function(req, res, next) {
       console.log('receiving get request');
    });
    app.post('Post', function(req, res, next) {
       console.log('receiving post request');
    });
   // app.listen(port); //port 80 need to run as root

   // console.log("app listening on %d ", 8081);

var server = http.createServer(app);
    server.listen(port);

console.log("http server listening on %d", port);

var onlineUsers=[];
var users=0;
var wss = new WebSocketServer({server: server});
    wss.on("connection", function (ws) {
 
var userId;
var username;
    console.info("websocket connection open");
 
    userId = ++users;//timestamp;

    ws.on("message", function (data, flags) {
       // console.log("websocket received a message",data);
if (flags.binary){
wss.broadcast(data);
}
else
{
  var msg=JSON.parse(data); 
console.log(msg);
switch (msg.sys){
case "msg":
msg.input=msg.input.replace('<','<&nbsp'); wss.broadcast(JSON.stringify({id:username,data:msg.input,sys:"userMessage"}));break;

case "nick":
username=msg.nick;
onlineUsers.push(username);
wss.broadcast(JSON.stringify({users:onlineUsers,sys:"onlineUsers"}));
wss.broadcast(JSON.stringify({id:username,data:"вошел в чат",sys:"userEnter"}));break;

case "file": 
wss.broadcast(JSON.stringify({user:username,file:msg.file,sys:"file",parts:msg.parts}));break;
}}

    });

    ws.on("close", function () {
        console.log("websocket connection close");
onlineUsers.splice(onlineUsers.indexOf(username),1);
wss.broadcast(JSON.stringify({users:onlineUsers,sys:"onlineUsers"}));
wss.broadcast(JSON.stringify({id:username,data:"покинул чат",sys:"userExit"}));
    });
});
wss.broadcast = function broadcast(data) {
try{  wss.clients.forEach(function each(client) {
    client.send(data);

  });}
catch (e)
{console.log(e);}
};
 
console.log("websocket server created");
