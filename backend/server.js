const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Authentication Routes
app.use("/auth", require("./routes/auth"));

// WebSocket connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
