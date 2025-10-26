const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
// Body Parser Code.
app.use(bodyParser.json());

// Database connection code
mongoose.connect('mongodb+srv://deeplongia0002_db_user:KM4fc6mmf3AZYbNl@cluster0.1ortb87.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{console.log("database connected");})
.catch((err)=>{console.log(err.message);})



// Creating Schema and Model
const userSchema = new mongoose.Schema({
  name: String, 
  email: String, 
  password: String, 
  age:Number
});

const User = mongoose.model('User', userSchema);


// ===================== VLOG SCHEMA =====================
const VlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  youtubeLink: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});
const Vlog = mongoose.model("Vlog", VlogSchema);

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY"); // ⚠️ Replace with env var
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};


// Auth Routes
// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, age });
    return res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });

  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});


//Get All the Users
app.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } 
  catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});





// Post - Save the data
// app.post("/", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     return res.status(200).json(user);
//   } 
//   catch (err) {
//     return res.status(400).json({ message: err.message });
//   }
// });

// update the record
app.put("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true} );
    return res.status(200).json(user);
  } 
  catch (err) {
    return res.status(400).json({ message: err.message });
  }
});


app.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({message:"Your data deleted successfully"});
  } 
  catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } 
  catch (err) {
    return res.status(400).json({ message: err.message });
  }
});


// ===================== VLOG CRUD (Protected) =====================

// Create vlog
app.post("/vlogs", authMiddleware, async (req, res) => {
  try {
    const { title, description, youtubeLink, tags } = req.body;
    const vlog = await Vlog.create({
      title,
      description,
      youtubeLink,
      tags,
      createdBy: req.user.id,
    });
    return res.status(201).json({ message: "Vlog created successfully", vlog });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get all vlogs
app.get("/vlogs", authMiddleware, async (req, res) => {
  try {
    const vlogs = await Vlog.find().populate("createdBy", "name email");
    return res.status(200).json(vlogs);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get vlog by ID
app.get("/vlogs/:id", authMiddleware, async (req, res) => {
  try {
    const vlog = await Vlog.findById(req.params.id).populate("createdBy", "name email");
    if (!vlog) return res.status(404).json({ message: "Vlog not found" });
    return res.status(200).json(vlog);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Update vlog
app.put("/vlogs/:id", authMiddleware, async (req, res) => {
  try {
    const vlog = await Vlog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vlog) return res.status(404).json({ message: "Vlog not found" });
    return res.status(200).json({ message: "Vlog updated successfully", vlog });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Delete vlog
app.delete("/vlogs/:id", authMiddleware, async (req, res) => {
  try {
    const vlog = await Vlog.findByIdAndDelete(req.params.id);
    if (!vlog) return res.status(404).json({ message: "Vlog not found" });
    return res.status(200).json({ message: "Vlog deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("server is running on localhost 3000");
});
