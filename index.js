const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://ExpenseDB:F52ktVyHmdY9cu5@cluster0.idbesa6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
        const expenseCollection = client.db('Expense-Manage').collection('Expenses');


        app.get('/expense', async(req,res) =>{
          const query = {};
          const cursor = expenseCollection.find(query);
          const  expense = await cursor.toArray();gi




          
          res.send(expense);
        })



        app.post('/expense', async(req,res) =>{
          const expense =  req.body;
          const result = await expenseCollection.insertOne(expense);
          res.send(result); 
        })

       

       
  }
  finally{

  }

}

run().catch(err => console.error(err));


 app.get('/',(req,res) => {
  res.send('Simple node Server is Running');
});
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })