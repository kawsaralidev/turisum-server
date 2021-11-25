const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzu0z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("turisum");
        const servicesCollection = database.collection("services");
        const bookingCollection = database.collection("book")
        // get all services 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })
        // get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // get post
        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await servicesCollection.insertOne(services);
            console.log(result);
            res.json(result)
        })
        //============================================
        // get booking 

        app.get("/booking", async (req, res) => {
            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //  post booking 
        app.post("/booking", async (req, res) => {
            const cursor = req.body;
            const result = await bookingCollection.insertOne(cursor);
            res.json(result);
        });
        //-------------- Delete Api ------------------

        app.delete("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})