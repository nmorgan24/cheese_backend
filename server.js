////////////////////////////
// IMPORT OUR DEPENDENCIES
////////////////////////////
// read our .env file and create environmental variables
require("dotenv").config();
// pull PORT from .env, give default value
// const PORT = process.env.PORT || 8000
// const DATABASE_URL = process.env.DATABASE_URL
const { PORT = 8000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import cors
const cors = require("cors");
// import morgan
const morgan = require("morgan");

///////////////////////////
// DATABASE CONNECTION
///////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL);

// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

////////////////////////////
// Models
////////////////////////////
// models = PascalCase, singular "cheese"
// collections, tables =snake_case, plural "cheeses"

const cheeseSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
});

const Cheese = mongoose.model("Cheese", cheeseSchema);

//////////////////////////////
// Middleware
//////////////////////////////
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors());
// morgan for logging requests
app.use(morgan("dev"));
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json());

////////////////////////////
// ROUTES
////////////////////////////

// "/people"
// INDUCES - INDEX, xNEWx, DELETE, UPDATE, CREATE, xEDITx, SHOW
// IDUCS - INDEX, DESTROY, UPDATE, CREATE, SHOW (FOR AN JSON API)

// INDEX - GET - /cheese - gets all people
app.get("/cheese", async (req, res) => {
  try {
    // fetch all cheese from database
    const cheese = await Cheese.find({});
    // send json of all cheese
    res.json(cheese);
  } catch (error) {
    // send error as JSON
    res.status(400).json({ error });
  }
});

// CREATE - POST - /cheese - create a new cheese
app.post("/cheese", async (req, res) => {
  try {
    // create the new cheese
    const cheese = await Cheese.create(req.body);
    // send newly created cheese as JSON
    res.json(cheese);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// SHOW - GET - /cheese/:id - get a single cheese
app.get("/cheese/:id", async (req, res) => {
  try {
    // get a cheese from the database
    const cheese = await Cheese.findById(req.params.id);
    // return the person as json
    res.json(cheese);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// UPDATE - PUT - /cheese/:id - update a single cheese
app.put("/cheese/:id", async (req, res) => {
  try {
    // update the cheese
    const cheese = await Cheese.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // send the updated cheese as json
    res.json(cheese);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// DESTROY - DELETE - /cheese/:id - delete a single cheese
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete the cheese
        const cheese = await Cheese.findByIdAndDelete(req.params.id)
        // send deleted cheese as json
        res.status(204).json(cheese)
    } catch(error){
        res.status(400).json({error})
    }
})

// create a test route
app.get("/", (req, res) => {
  res.json({ hello: "world" });
});

////////////////////////////
// LISTENER
////////////////////////////
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));