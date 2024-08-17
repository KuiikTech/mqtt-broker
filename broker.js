import aedes from "aedes";
import net from "net";
import ws from "websocket-stream";
import http from "http";

// puero de comunicación del servidor broker mqtt
const mqttPort = 1883;
const wsPort = 8888;

// instancia del broker
const broker = aedes();

// instancia del servidor pasando la instancia del broker
const mqttServer = net.createServer(broker.handle);

// instancia del servidor http y websocket
const httpServer = http.createServer();
const wsServer = ws.createServer(
  {
    server: httpServer,
  },
  broker.handle
);

// servidor escuchando en el puerto 1883
mqttServer.listen(mqttPort, () => {
  console.log("MQTT server listening on port", mqttPort);
});

// servidor http y websocket escuchando en el puerto 8888
httpServer.listen(wsPort, () => {
  console.log("Websocket server listening on port", wsPort);
});

// evento lanzado cuando se conecta un nuevo cliente
wsServer.on("connection", () => {
  console.log("Websocket client connected");
});

// evento lanzado cuando se conecta un nuevo cliente
mqttServer.on("connection", (socket) => {
  console.log("Client connected:", socket.remoteAddress, socket.remotePort);
});

// evento que maneja la llegada de un nuevo mensaje desde un cliente
broker.on("publish", (packet) => {
  // console.log("Topic: ", packet.topic, "Payload: ", packet.payload.toString());
});
