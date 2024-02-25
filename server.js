const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Serve sensor.html file (make sure the path is correct)
app.get('/sensor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/sensor.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});

// Serve static files from public directory
app.use(express.static('public'));

// Create an HTTP server and attach the Express app to it
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;


let unityClient = null;
let phoneClient = null;

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log(`Client connected`);
    ws.on('message', (m) => {
        try {
            const messageStr = m.toString('utf8');
            console.log(messageStr);
    
            if(messageStr == "Unity"){
                unityClient = ws;
                if(phoneClient!=null){
                    unityClient.send("PhoneConnected");
                }
                console.log(`Client identified as Unity`);
            }

            else if(messageStr == "Phone"){
                phoneClient = ws;
                if(unityClient!=null){
                    unityClient.send("PhoneConnected");
                }
                console.log(`Client identified as Phone`);
            }
            else{
                if (unityClient!=null) {
                    sendMessageToUnityClient(m);
                  }
            }
        } catch (e) {
            console.error('Failed to parse message:', m);
        }
      });

    ws.on('close', () => {
        console.log(`Client disconnected`);
        ws.close();
        phoneClient=null;
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function sendMessageToUnityClient(message) {
    if (unityClient && unityClient.readyState === WebSocket.OPEN) {
        unityClient.send(message);
    } else {
        console.log(`unityClient not found or connection is not open.`);
    }
}

