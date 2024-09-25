const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

console.log("Starting server initialization...");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Make sure this matches your React app's URL
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

console.log("Attempting to initialize Firebase Admin SDK...");

// Add more detailed error handling for Firebase Admin SDK initialization
try {
  const serviceAccount = require("./new4-af3fb-firebase-adminsdk-bawyx-f8eed4cdaa.json"); // Update this path
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  console.error("Error details:", JSON.stringify(error, null, 2));
  process.exit(1);
}

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add a test route
app.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running and Firebase Admin SDK is initialized",
  });
});

// API endpoint to delete a user
app.post("/api/deleteUser", async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().deleteUser(uid);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// New API endpoint to create a student
app.post("/api/createStudent", async (req, res) => {
  const { name, email, password, teacherId } = req.body;
  console.log("Received request to create student:", {
    name,
    email,
    teacherId,
  });

  try {
    if (!name || !email || !password || !teacherId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    console.log("User created in Authentication:", userRecord.uid);

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      name: name,
      email: email,
      role: "student",
      teacherId: teacherId,
    });

    console.log("User document created in Firestore");

    res.json({
      status: "success",
      message: "Student created successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// New route to get outcomes data
app.get("/api/outcomes", (req, res) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, "data", "OutcomesContent.csv"))
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    });
});

// Add this new route to your server.js
app.get("/api/curriculum-structure", (req, res) => {
  console.log("Received request for curriculum structure");
  const structure = {};
  fs.createReadStream(path.join(__dirname, "data", "OutcomesContent.csv"))
    .pipe(csv())
    .on("data", (data) => {
      if (!structure[data.Stage]) {
        structure[data.Stage] = {};
      }
      if (!structure[data.Stage][data.Area]) {
        structure[data.Stage][data.Area] = {};
      }
      if (!structure[data.Stage][data.Area][data["Focus areas & outcomes"]]) {
        structure[data.Stage][data.Area][data["Focus areas & outcomes"]] = [];
      }
      structure[data.Stage][data.Area][data["Focus areas & outcomes"]].push(
        data["Content points"]
      );
    })
    .on("end", () => {
      console.log(
        "Finished processing CSV, structure:",
        JSON.stringify(structure, null, 2)
      );
      res.json(structure);
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});

// 404 handler - Make sure this is the last middleware
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

console.log("Server initialization complete.");

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
