import express from "express";
import { readFileSync } from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import { BotClient } from "..";
import { join } from 'path'

export default (client: BotClient): Server => {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    
    io.on("connection", async (socket) => {
        const m = (await readFileSync(join(client.path, "/stdout.log"))).toString().split("\n").filter(e => e.length != 0);
        const n = m.length;
        const nbl = m.length < 50 ? m.length : 50;
        let i = 0;
        while (i < nbl && m[n - nbl + i] != undefined){
            await socket.emit("log", m[n - nbl + i]);
            i++;
        }
        io.emit("consolenb", io.sockets.sockets.size);
        if (client.bot) io.emit("guildnb", client.bot.guilds.cache.size);
        socket.on("disconnect", () => {
            io.emit("consolenb", io.sockets.sockets.size);
        })
    });

    app.get("/", (req, res) => {
        res.sendFile("index.html", { root: './src/Server/' });
    })

    app.get("/style.css", (req, res) => {
        res.sendFile("style.css", { root: './src/Server/' });
    })
    
    httpServer.listen(3000);

    return io;
}