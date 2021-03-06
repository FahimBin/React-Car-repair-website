const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const cors = require('cors');
const { json } = require('express');
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phflh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        //console.log("connected to db");

        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        // get all data (get api)
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // get single service
          app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
          });
            // post api
        app.post("/services", async (req, res) => {
          const service = req.body;
          console.log("hit the post api", service);

          const result = await servicesCollection.insertOne(service);
          console.log(result);
          res.json(result);
        });
        // Delete api
        app.delete("/services/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await servicesCollection.deleteOne(query);
          res.json(result);
        });
}
    finally {
            // await client.close();
        }
    }


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running genius server");
});

app.listen(port, () => {
    console.log('Running server on port', port);
});

