const express = require("express");
const connectDB = require("./config/db");

const app = express();

// CONNECT DB
connectDB();

// INIT Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "Welcome Contact API" });
});

// DEFINE ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started ${PORT}`);
});
