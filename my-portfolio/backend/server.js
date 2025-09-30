const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/portfolioDB");

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});
const Contact = mongoose.model("Contact", ContactSchema);

// Signup
app.post("/signup", async (req,res)=>{
  const {username,password} = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({username, password: hash});
  res.send("User Created");
});

// Login
app.post("/login", async (req,res)=>{
  const {username,password} = req.body;
  const user = await User.findOne({username});
  if(!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(400).send("Invalid Password");

  const token = jwt.sign({id:user._id}, "secretKey");
  res.json({token});
});

// Contact
app.post("/contact", async (req,res)=>{
  await Contact.create(req.body);
  res.send("Message Saved");
});

app.listen(5000, ()=> console.log("Server running on port 5000"));
