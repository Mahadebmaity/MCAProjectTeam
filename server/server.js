require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = Number(process.env.PORT || 5000);

const allowedOrigins = String(process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(
        new Error(`Origin not allowed by CORS: ${origin}`)
      );
    },

    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    return res.json({
      success: true,
      message: "API and MySQL are connected.",
    });

  } catch (error) {
    console.error("Health check error:", error);

    return res.status(500).json({
      success: false,
      message: "API is running but MySQL connection failed.",
    });
  }
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Unexpected server error.",
  });
});

app.listen(PORT, () => {
  console.log(
    `MCA Project Team API running at http://localhost:${PORT}`
  );
});