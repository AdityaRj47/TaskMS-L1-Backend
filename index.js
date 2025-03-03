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


  //MiddleWare
  const app = express();
  app.use(express.json(), express.urlencoded({extended: true}),cors() );
  
  //CREATE Task
  app.post("/task", async(req, res) =>{
      const {title, description, due_date} = req.body;
      if(!title || !description || !due_date){
        return res 
           .status(400)
           .json({message: "All fields are required!!"})
      }
      try{
        const newTask = await new TaskModel ({
          title,
          description,
          due_date,
        }).save();
          return res.status(201).json({status: "Created", task: newTask});
              
      }catch(err) {
           console.error("Error creating Task:", err);
           res.status(500).json({success: false, message: err.message});
         };
  });

  //GET all tasks
  app.get("/tasks", async(req, res) =>{
    try{
      const tasks = await  TaskModel.find();
       res
         .status(201).json({status: "Fetched", tasks});
    }catch (err){
      console.error("Error fetching Task:", err);
      res.status(500).json({success: false, message: err.message});
    }
  });

  //UPDATE Task
  // app.put("/task/:id", async(req,res) =>{
  //    const { id } = req.params;
  //    const{ title, description, due_date} = req.body;
  //    try{
  //     const task = await TaskModel.findById(id);
  //     if(!task) 
  //        return res.status(404).json({message:"Task not found!"});
      
  //     Object.assign(task,{title, description, due_date});
  //     const updatedTask = await task.save();
  //     res.status(200).json({message:" Task updated successfully", task: updatedTask});
  //    }catch(err){
  //     res.status(500).json({success: false , message: err.message});
  //    }
  // });

  app.put("/task/:id", async(req,res)=>{
    try{
       const taskId = req.params.id;
       //Update book in the database
       const updatedTask = await TaskModel.findByIdAndUpdate(taskId,{
           title: req.body.title,
           description: req.body.description,
           due_date: req.body.due_date, 
        },
        {new: true} //updating data from old to NEW
      );
      if(!updatedTask){
        res 
           .status(404)
           .json({success: false, message:"Task Not Found"});
      }else{
         res
            .status(200)
            .json({success: true, message: "Task Updated Successfully", data: updatedTask});
      }
    }catch(error){
       res
         .status(500)
         .json({success: false, message: "Error Occurred!", error: error.message});
    }
});

//DELETE Task by ID
app.delete("/task/:id", async(req, res) =>{
  try{
      const taskId = req.params.id;
      const deletedTask = await TaskModel.findByIdAndDelete(taskId);
      if(!deletedTask){
          res 
             .status(404)
             .json({success: false, message:"Entered Task Not Found"});
        }else{
           res
              .status(200)
              .json({success: true, message: "Task Deleted Successfully"});
        }
  }catch(error){
      res
      .status(500)
      .json({success: false, message: "Error Occurred!", error: error.message});
  }
});


  //To check the start and end time 
  const startTime = Date.now();
  http.createServer(app).listen(port,() =>{
     const endTime = Date.now();
     console.log(`Server running on port ${port} , Time taken is ${endTime - startTime} ms`);
  });

