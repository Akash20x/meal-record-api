const express = require("express");
const app = express();
const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meal');
const adminRoutes = require('./routes/admin');
const { verifyToken } = require("./middleware/verifyToken");
const { isAdmin } = require("./middleware/isAdmin");

const cors = require("cors");
const connectDB = require('./config/db');

require("dotenv").config();

connectDB();

//Body Parsing
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);           
app.use("/api/meal", verifyToken, mealRoutes);       
app.use('/api/admin', verifyToken, isAdmin, adminRoutes);

app.get('/', (req, res) => {
  res.status(200).json('Welcome to the meal record API');
});
    
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running");
});