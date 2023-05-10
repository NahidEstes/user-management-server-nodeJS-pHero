const { MongoClient, ServerApiVersion } = require("mongodb");

const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

//todo Middleware
app.use(cors());
app.use(express.json());

// const categories = require("./data/categories.json");

// userName: nahidestes
// password: BH7EmQEurM7M008K

const uri =
  "mongodb+srv://nahidestes:BH7EmQEurM7M008K@cluster0.33bueao.mongodb.net/?retryWrites=true&w=majority";

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

    // const database = client.db("usersDB");
    // const userCollection = database.collection("users");

    const userCollection = client.db("usersDB").collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
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
  res.send("hello");
});

app.listen(port, () => {
  console.log(`MongoDB is running on port: ${port}`);
});
