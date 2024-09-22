import * as Aedes from "aedes";
import net from "net";
import ws from "websocket-stream";
import http from "http";

// puero de comunicación del servidor broker mqtt
const mqttPort = 1883;
const wsPort = 8080;

// instancia del broker
const broker = Aedes.createBroker();

// instancia del servidor pasando la instancia del broker
const mqttServer = net.createServer(broker.handle);

// instancia del servidor http y websocket
const httpServer = http.createServer();
const wsServer = ws.createServer(
  {
    server: httpServer,
  },
  broker.handle as any
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
  console.log("Topic: ", packet.topic, "Payload: ", packet);
});

// import ws from 'ws';

// const wss = new ws.Server({ port: 8080 });

// wss.on("connection", function connection(ws) {
//   console.log("New client connected");
//   ws.on("message", function incoming(message) {
//     console.log("received: %s", message);
//   });
//   ws.send("Hello from server");
// });


// import WebSocket from 'ws';

// // Conectar al servidor WebSocket
// const ws = new WebSocket('wss://mqtt-broker-1.onrender.com');

// // Escuchar cuando la conexión esté abierta
// ws.on('open', () => {
//   console.log('Connected to WebSocket server');

//   // Enviar un mensaje al servidor
//   ws.send('Hello, Server!');
// });

// // Escuchar mensajes del servidor
// ws.on('message', (message) => {
//   console.log('Received from server:', message.toString());
// });

// // Escuchar el cierre de la conexión
// ws.on('close', () => {
//   console.log('Disconnected from server');
// });

// // Manejar errores
// ws.on('error', (error) => {
//   console.error('WebSocket error:', error);
// });

