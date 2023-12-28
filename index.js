const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://work-flow-1edd4.web.app",
      "https://work-flow-1edd4.firebaseapp.com",
    ],
    credentials: true,
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rml2ff.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allTasksCollection = client.db("workFlowDB").collection("allTasks");

    // get all tasks
    app.get("/allTasks", async (req, res) => {
      const email = req.query.email;
      const query = { user: email };
      // console.log(filter);

      // const cursor = allTasksCollection.find(filter);
      const result = await allTasksCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });

    // add task
    app.post("/allTasks", async (req, res) => {
      const newTask = req.body;
      const result = await allTasksCollection.insertOne(newTask);
      res.send(result);
      // console.log(result);
    });
    // Send a ping to confirm a successful connection

    // delete a task
    app.delete("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allTasksCollection.deleteOne(query);
      console.log(query);
      res.send(result);
    });

    // update for todo to ongoing  status
    app.patch("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "Ongoing",
        },
      };
      const result = await allTasksCollection.updateOne(filter, updateStatus);
      // console.log(result);
      res.send(result);
    });
    // update for ongoing to completed  status
    app.patch("/allTasksCom/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = {
        $set: {
          status: "Completed",
        },
      };
      const result = await allTasksCollection.updateOne(filter, updateStatus);
      // console.log(result);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task-management server starting");
});

app.listen(port, () => {
  console.log(`Task management  ${port}`);
});
