"use strict"
const mongoose = require("mongoose");
const DB = "mongodb+srv://rahulkumar:rahul1234@cluster1.wdbxwjd.mongodb.net/chat?retryWrites=true&w=majority"
mongoose.connect(DB).then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log("no connected", err);
})


