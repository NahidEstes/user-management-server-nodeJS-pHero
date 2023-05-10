const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Code

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri =
//   "mongodb+srv://nahidestes:BH7EmQEurM7M008K@cluster0.33bueao.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb://127.0.0.1:27017/";

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

    // const database = client.db("userDB");
    // const userCollection = database.collection("users");

    const userCollection = client.db("userDB").collection("users");

    // get result from database

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUsers = req.body;
      console.log(newUsers);
      const result = await userCollection.insertOne(newUsers);
      res.send(result);
    });

    // delete
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // put
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        options
      );
      res.send(result);
    });

    // app.get("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await userCollection.findOne(query);
    //   res.send(result);
    // });

    //
    // app.get("/users", async (req, res) => {
    //   const cursor = userCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    // app.get("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await userCollection.findOne(query);
    //   res.send(result);
    // });

    // // Put -----------------
    // app.put("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const user = req.body;
    //   console.log(user);
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedUser = {
    //     $set: {
    //       name: user.name,
    //       email: user.email,
    //     },
    //   };
    //   const result = await userCollection.updateOne(
    //     filter,
    //     updatedUser,
    //     options
    //   );
    //   res.send(result);
    // });

    // // Post -----------------
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    //todo // Delete -----------------
    // app.delete("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   console.log("please delete", id);
    //   const query = { _id: new ObjectId(id) };
    //   const result = await userCollection.deleteOne(query);
    //   res.send(result);
    // });

    // const usersCollection = client.db("usersDB").collection("users");

    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   console.log("new user", user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

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
  res.send("running user information");
});

app.listen(port, () => {
  console.log(`MongoDB is running on port: ${port}`);
});
