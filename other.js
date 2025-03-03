require ("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require ("cors");
const TaskModel = require ("./task-model");

//setting PORT and MONGO-DB connection URL --> to access fromthe .env file
const port = process.env.PORT || 8001;
const mongodbUrl = 
  process.env.MONGODB_URL || "mongodb://localhost:27017/defaultDB";

//Connect to MongoDB
mongoose.connect(mongodbUrl,{
    useNewUrlParser: true,  
    useUnifiedTopology: true, 
})
.then(() =>
   console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection failed:", error));

//OR
// mongoose.connect(mongodbUrl);
// mongoose.connection.on("error",(error) =>{
//     console.log("Unable to connect to MongoDb Database");
//     console.error(error.message);
// })

//Server setup
const startHttpServer = async function(){
  const app = express();
  //MiddleWare
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(cors());
  
  //Create Task
  app.post("/task", async(req, res) =>{
     try{
      const {title, description, due_date} = req.body;
      if(!title || !description || !due_date){
        return res 
           .status(400)
           .json({message: "All fields are required!!"})
      }
      const newTask = new TaskModel ({
        title,
        description,
        due_date,
      });
       newTask
         .save()
         .then((saveDoc) =>{
            if(saveDoc) {
              res.status(201).json({status: "created", task: saveDoc});
            }else{
               throw new Error ("failed to save document");
            }
         })
         .catch((err) =>{
           console.error("Error creating Task:", err);
           res.status(500).json({success: false, message: err.message});
         });
     }catch(error){
        console.error("Error creating Task:", err);
        res. status(500).json({ success: false, message: err.message});
     }
  });
};  
                            
                            

