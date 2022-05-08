
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.TECH_USER}:${process.env.TECH_PASS}@cluster0.ayf1w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('Tech-BD').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //update
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;

            const addQuantity = req.body;
            console.log(addQuantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }

            const updateDoc = {
                $set: {
                    quantity: addQuantity.newQuantity
                }

            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        });

        //post 

        app.post('/service', async (req, res) => {
            const newService = req.body;
        })

        //delete

        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(console.dir);




app.get('/hero', (req, res) => {
    res.send('Update running tech bd')
})


app.get('/', (req, res) => {
    res.send('Running tech bd');
});

app.listen(port, () => {
    console.log('Listening to port');
});