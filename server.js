const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Serve your dashboard.html file (make sure the path is correct)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sensor.html'));
});

// Serve static files from public directory
app.use(express.static('public'));

// Create an HTTP server and attach the Express app to it
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

let sender = 0;

// Handle WebSocket connections
wss.on('connection', (ws) => {
    const id = ++clientId; // Increment the ID for each new connection
    clients.set(id, ws);
    console.log(`Client ${id} connected`);
    ws.on('message', (m) => {
        try {
            const messageStr = m.toString('utf8');
            console.log(messageStr);
    
            if(messageStr == "Unity"){
                clients.set(0, ws);
                console.log(`Client identified as Unity`);
            }
            else{
                if (clients.has(0) && sender<=2) {
                    sendMessageToClient(0, m);
                  }
            }
        } catch (e) {
            console.error('Failed to parse message:', m);
        }
      });

    ws.on('close', () => {
        clients.delete(id);
        console.log(`Client ${id} disconnected`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let clientId = 1;
const clients = new Map();

function sendMessageToClient(clientId, message) {
    const client = clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(message);
    } else {
        console.log(`Client ${clientId} not found or connection is not open.`);
    }
}

