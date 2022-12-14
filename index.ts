import express from "express";
import http from "http";
import { Server } from "socket.io";
import { version } from "./package.json";

import cors from "cors";
import * as dotenv from "dotenv";
import SuccessResponse from "./responses/SuccessResponse";
import playerRouter from "./routers/playerRouter";
import roomRouter from "./routers/roomRouter";
import gameHandler from "./socket/gameHandler";
import messageHandler from "./socket/messageHandler";
import roomHandler from "./socket/roomHandler";
import { ServerToClientEvents } from "./Types";

const app = express();
const server = http.createServer(app);
const io = new Server<ServerToClientEvents>(server, {
	cors: {
		origin: "*",
	},
});

// Config dotenv
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
	// TODO: Keep version somewhere sage
	return new SuccessResponse("Server is running", {
		version,
	}).handleResponse(req, res);
});

// Routers
app.use("/api/room", roomRouter);
app.use("/api/player", playerRouter);

io.on("connection", (socket) => {
	console.log("Current active sockets: ", io.engine.clientsCount);
	console.log(`A user connected (${socket.id})`);

	roomHandler(io, socket);
	gameHandler(io, socket);
	messageHandler(io, socket);

	socket.on("disconnect", () => {
		console.log(`A user disconnected (${socket.id})`);
	});
});

server.listen(process.env.PORT, () => {
	console.log(`listening on *:${process.env.PORT}`);
});
