const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    due_date: Date,
});

module.exports = mongoose.models?. Task || mongoose.model("Task", taskSchema);
//optional chaining to check if already the Task is present or not, THEN  add it to the same collection, ELSE create a new one.

