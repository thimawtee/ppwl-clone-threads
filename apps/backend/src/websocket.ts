import { WebSocketServer } from "ws";
import http from "http";

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws/notifications",
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    // TEST notif otomatis
    setTimeout(() => {
      ws.send(
        JSON.stringify({
          type: "LIKE",
        })
      );
    }, 3000);

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}