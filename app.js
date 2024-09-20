const express =require('express');
const cors=require('cors');
const dotenv =require("dotenv") ;
import authRoutes from "./routes/authRoutes";
import classRoutes from "./routes/classRoutes";
const app= new express ();

dotenv.config();

// Middleware and routes
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Wellcome to My Gym-Management System");
});
app.use("/api/auth", authRoutes);
app.use("/api/class", classRoutes);

//Database 
const mongoose= require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((error) =>  console.log(error));
  
  module.exports=app;
