"use strict";
const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");
var path = require('path');
// 読み取るMIMEタイプ
var mime = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js": "text/javascript",
    ".png": "image/png"
};


var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});
// サーバーを起動
var server = http.createServer((req, res) => {
    var filePath = req.url;                 // パスを取得
    if (filePath == "/") {
        filePath = "/index.html";
    }
    var fullPath = __dirname + filePath;    // 絶対パスへ変換
    res.writeHead(200, {"Content-Type": mime[path.extname(fullPath)] || "text/plain"});
    fs.readFile(fullPath, (err, data)=>{
        if (err) {
            // エラー時
            console.log(err);
        } else {
            res.end(data, "UTF-8");
        }
    });
}).listen(3456);
console.log("サーバーが起動しました\nhttp://localhost:3456");



// サーバーと紐付け
var io = socketio.listen(server);
io.sockets.on("connection", (socket)=>{
    console.log("クライアントと接続されました");
    socket.on("start",data=>console.log(data))
    socket.on("apisStat",data=>console.log(data))
    socket.on('info',data=>console.log(data))
    //apisStat
})