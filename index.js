const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app=express();
 
// middleware
app.use(cors());
app.use(express.json());
 
app.get('/',(req,res)=>{
    res.send('running todo apps')
})
 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qe05g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run(){
    try{
        await client.connect();
        const myTaskCollection =client.db('MyToDoApps').collection('myTask');
    //    add a task 
        app.post('/task',async (req,res)=>{
            const myTask=req.body;
           
            const result =await myTaskCollection.insertOne(myTask);
            res.send(result);
         })
        //  get all task 
         app.get('/task',async(req,res)=>{
             const query={}
             const cursor=myTaskCollection.find(query);
             const result=await cursor.toArray();
             res.send(result);
         })
    //    delete a task 
         app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myTaskCollection.deleteOne(query);

            res.send(result);
        });

 
    }catch{
 
    }
 
}
run().catch(console.dir);
app.listen(port,()=>{
    console.log('server is running',port)
})
