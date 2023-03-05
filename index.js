const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://ExpenseDB:F52ktVyHmdY9cu5@cluster0.idbesa6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const expenseCollection = client
      .db("Expense-Manage")
      .collection("Expenses");
    const mainexpenseCollection = client
      .db("Expense-Manage")
      .collection("Mainexpense");

    //FOR BUDGET

    app.get("/expense", async (req, res) => {
      const query = {};
      const cursor = expenseCollection.find(query);
      const expense = await cursor.toArray();
      res.send(expense);
    });

    app.post("/expense", async (req, res) => {
      const expense = req.body;
      const result = await expenseCollection.insertOne(expense);
      res.send(result);
    });

    app.get("/expense/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await expenseCollection.findOne(query);
      res.send(result);
    });
    app.get("/mainexpense/:id", async (req, res) => {
      const id = req.params.id;
      const query = { budgetId: id };
      const result = await mainexpenseCollection.findOne(query);
      res.send(result);
    });

    app.put("/mainexpense/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { budgetId: id };
      const expense = req.body;
      console.log(expense);
      const options = { upsert: true };
      const updateexpense = {
        $set: {
          Expense: expense.price,
          is_deleted: false,
        },
      };
      const result = await mainexpenseCollection.updateOne(
        filter,
        updateexpense,
        options
      );
      res.send(result);
    });

    app.get("/expense", async (req, res) => {
      let query = {};
      if (req.query.uid) {
        query = {
          uid: req.query.uid,
        };
        console.log(req.query.uid);
      }

      const cursor = expenseCollection.find(query);
      const myexpense = await cursor.toArray();
      res.send(myexpense);
    });

    app.get("/mainexpense", async (req, res) => {
      let query = {};
      if (req.query.uid) {
        query = {
          uid: req.query.uid,
        };
        console.log(req.query.uid);
      }

      const cursor = mainexpenseCollection.find(query);
      const myexpense = await cursor.toArray();
      res.send(myexpense);
    });

    app.delete("/mainexpense/:id", async (req, res) => {
      const id = req.params.id;
      const query = { budgetId: id };
      const update = { $set: { is_deleted: true } };
      const options = { new: true };

      const result = await mainexpenseCollection.findOneAndUpdate(
        query,
        update,
        options
      );

      res.send(result);
      console.log("trying to soft delete", id);
    });

    //FOR EXPENSE

    app.get("/mainexpense", async (req, res) => {
      const query = {};
      const cursor = mainexpenseCollection.find(query);
      const expense = await cursor.toArray();
      res.send(expense);
    });

    app.post("/mainexpense", async (req, res) => {
      const expense = req.body;
      const result = await mainexpenseCollection.insertOne(expense);
      res.send(result);
    });

    app.get("/mainexpense/:id", async (req, res) => {
      const uid = req.query.uid;
      const query = { uid: uid };
      const result = await mainexpenseCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Simple node Server is Running");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
