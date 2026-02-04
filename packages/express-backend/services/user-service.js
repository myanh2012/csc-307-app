import mongoose from "mongoose";
import userModel from "../models/user.js";

//removed mongoose connect: there is already connect in backend.js 

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  } else if (name && job) { // find both by name and job 
    promise = findUserByName(name).then((users) =>
        users.filter((user) => user.job === job)
    );
}
  return promise;
}

function deleteUserById(id) { //delete by id 
  return userModel.findByIdAndDelete(id);
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUserById
};