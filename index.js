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
          const  expense = await cursor.toArray();
          res.send(expense);
        })



        app.post('/expense', async(req,res) =>{
          const expense =  req.body;
          const result = await expenseCollection.insertOne(expense);
          res.send(result); 
        })

        app.get('/expense/:id', async(req,res) =>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await expenseCollection.findOne(query);
          res.send(result);
      })

      
        app.put('/expense/:id',async(req,res) =>{
          const id = req.params.id;
          const filter = {_id: new ObjectId(id)};
          const expense = req.body;
          const option = {upsert: true};
          const updateexpense = {
            $set: {
                Category: expense.category,
                Currency: expense.currency,
                Price: expense.price,

            }
          }
          const result = await expenseCollection.updateOne(filter,updateexpense,option);
          res.send(result);

      })

      app.get('/expense', async(req,res) => {
        let query = {};
        if(req.query.uid){
          query = {
               uid: req.query.uid
          }
          console.log(req.query.uid);
        }   
        
        const cursor = expenseCollection.find(query);
        const myexpense = await cursor.toArray();
        res.send( myexpense );
      
      });
  

    //   app.get('/expense/:uid', async (req, res) => {

    //     const uid = req.params.uid;
    //     const query = { uid }
    //     console.log(uid);
    //     const cursor = await expenseCollection.find(query);
    //     const expense = await cursor.toArray();
    //     res.send(expense);

    // });
       app.delete('/expense/:id', async (req, res) => {
       const id = req.params.id;
       const query = { _id: new ObjectId(id) };
       const update = { $set: { is_deleted: true } };
       const options = { new: true };
     
       const result = await expenseCollection.findOneAndUpdate(query, update, options);
       
       res.send(result);
       console.log('trying to soft delete', id);
});

         
       
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