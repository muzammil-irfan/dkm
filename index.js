import express from 'express';
//It will led app to process env variables
import 'dotenv/config';
import db from './libs/db.js';
import tables from './routes/tables.js';
import admin from './routes/admin.js';
import customer from './routes/customer.js';
import location from './routes/location.js';
import user from './routes/user.js';
import ticket from './routes/ticket.js';
import bodyParser from 'body-parser';
//Here is the app to create server and api
const app = express();
const PORT = process.env.PORT || 3000;

// To connect sql database 
db.connect((err)=>{
    if(err){
        throw err;
    } else {
      console.log('MySql connected...')
    }
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use('/table',tables);
app.use('/admin',admin);
app.use('/customer',customer);
app.use('/location',location);
app.use('/user',user);
app.use('/ticket',ticket);

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get("*",(req,res)=>{
  res.status(404).send("Not found");
})
app.listen(PORT, () => {
  console.log(`DKM app listening on port ${PORT}`);
});
