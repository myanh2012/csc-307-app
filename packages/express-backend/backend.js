import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {  // root 
  res.send("Hello World!");
});

// mongosh 
dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

//helpers and builtin data removed  

// ------- routes -----------------
app.get("/users", (req, res) => {
    const name = req.query.name; //req.query.[keyword]
    const job = req.query.job;

    userService 
      .getUsers(name,job)
      .then((result) => {
        if (!result || result.length ===0) {
          res.status(404).send("user not found");
        }
        else {
          res.send({users_list: result});
        }        
      }).catch((error)=>{
        console.log(error);
        res.status(500).send(error);
      })
});

app.get("/users/:id", (req, res) => { //:id return unique 1 elem
  const id = req.params.id;
  userService
    .findUserById(id)
    .then((result) =>{
      if (result === null){
        res.status(404).send("Id not found");
      } else{
        res.send(result);
      }
    }). catch((error)=> {
      console.log(error);
      res.status(400).send(error);
    })
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
 
  userService
    .addUser(userToAdd)
    .then((newUser)=> {
      res.status(201).json(newUser);
    }).catch((error)=> {
      console.log(error);
      res.status(400).send(error);
    })
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    
    userService
      .deleteUserById(id)
      .then((deleteUser)=> {
        if (deleteUser === null){
          res.status(404).send("user not found");
        } else{
          res.status(204).send();
        }
      } ).catch((error)=>{
        console.log(error);
        res.status(400).send(error);
      })
}
)


// --------- listen --------------
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});