require('dotenv').config();
const express = require('express');
const {MongoClient, ObjectId}=require("mongodb");

const router = express.Router();
const MONGODB_URI=process.env.MONGODB_URI;

// Connect mongoDB with application using mongoDB URI 
let client=new MongoClient(MONGODB_URI);
const database=client.db('dmockcrm'); //get specific database from cluster

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected with MongoDB Atlas");
        
    } catch (error) {
        console.error("Error Connecting with MongoDB: "+ error);
    }
}

connectToMongoDB(); // functionCall to make connection with mongoDB
// Post
router.post('/post/:module', async (req, res) => {
    try {
        const { module }=req.params;
        const obj = req.body;
        const result = await database.collection(module).insertOne(obj);
        res.status(201).send({ id: result.insertedId, message: `Successfully inserted!` });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: 'Error creating ' });
    }
});
//Get By Id
router.get('/getById/:module/:id', async(req, res)=>{
    try {
        const { module , id}=req.params;
        const result=await database.collection(module).findOne({_id:ObjectId(id)});
        if(!result){
            return res.status(404).send({message: `${module} not Found!`});
        }
        res.send(result);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send({ message: 'Error fetching user by ID' });
    }
});

//Get All
router.get('/getAll/:module', async(req,res)=>{
    try {
        const { module }=req.params;
        const listOfUsers = await database.collection(module).find({}).toArray();
        res.json(listOfUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: 'Error fetching users' });
    }
});


// Update
router.put('/update/:module/:id', async (req, res) => {
    try {
        const {module, id} = req.params;
        const updateUser = req.body;
        await database.collection(module).updateOne({ _id: ObjectId(id) }, { $set: updateUser });
        res.send({ message: `user Updated!` });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: 'Error updating user' });
    }
});
// Delete
router.delete('/delete/:module/:id', async (req, res) => {
    try {
        const { module , id}=req.params;
        await database.collection(module).deleteOne({ _id: ObjectId(id) });
        res.send({ message: `User Deleted!` });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: 'Error deleting user' });
    }
});

module.exports=router;