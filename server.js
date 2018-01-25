const express = require('express')
const app = express()
const resolve = require('path').resolve;

app.use("/css", express.static(resolve(__dirname, "css")));
app.use("/globalnav", express.static(resolve(__dirname, "globalnav")));

app.use("/img", express.static(resolve(__dirname, "img")));
app.use("/js", express.static(resolve(__dirname, "js")));
app.use("/dist", express.static(resolve(__dirname, "dist")));
app.use("/api", express.static(resolve(__dirname, "api")));
app.use("/build", express.static(resolve(__dirname, "build")));

app.get('/', function (req, res) {
  res.sendFile('index.html' , { root : __dirname});
})

app.listen(3001, function () {
  console.log('App listening on port http://localhost:3001/')
})