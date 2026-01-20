import express from "express";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.use(express.json());

app.get("/", (req, res) => {  // root 
  res.send("Hello World!");
});

// ----------helper function -----------
const findUserByName = (name) => { 
  return users["users_list"].filter( //filter the user_list 
    (user) => user["name"] === name // inside filter find name that match 
    // => means a function takes name run the following code
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);
    // one liner doesn't need{} 

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUser = (userIdx) => {
    users["users_list"].splice(userIdx,1);
}

// ------- routes -----------------
app.get("/users", (req, res) => {
    const name = req.query.name; //req.query.[keyword]
    const job = req.query.job;

    let result = users.users_list;
    if (name !== undefined){ // filter the name 
        result = findUserByName(name); //return an array of matched elem
    }
    if (job !== undefined){ // use same result filter job 
        result = result.filter((user)=> user.job === job); 
    }

    if (result.length !== 0){ // empty array [] is defined 
        result = { users_list: result }; //wrap make it consitent declared users
        res.send(result); 
    } else{
        res.status(404).send("User not found");
    }
});

app.get("/users/:id", (req, res) => { //:id return unique 1 elem
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    const userIndex = users.users_list.findIndex(
        (user) => user.id === id);
    if (userIndex === -1){
        res.send("user not found");
    } else {
        deleteUser(userIndex);
        res.send("user deleted");
    }
})


// --------- listen --------------
app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});