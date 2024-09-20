const express =require('express');
const app= new express ();
const cors=require('cors');
const router =require("./src/routes/api");
const dotenv =require("dotenv") ;
dotenv.config();

// Middleware and routes
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Wellcome to My Gym-Management System");
});

app.use("/api/v1",router)


//Database 
const mongoose= require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((error) =>  console.log(error));
  
  module.exports=app;
