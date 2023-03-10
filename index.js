import http from "http";
import express from "express";
import {Server, Socket} from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connection from "./sockets.js";
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000
connection(io);
server.listen(port,() => {
    console.log("Server on port",port)
});

app.use(express.static("public"));

app.get("/online", (req, res) => {
    res.sendFile(__dirname + "/online.html");
})