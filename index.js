import express from 'express';
//It will led app to process env variables
import 'dotenv/config';
import './libs/db.js';
import tables from './routes/tables.js';
import admin from './routes/admin.js';
import customer from './routes/customer.js';
import bodyParser from 'body-parser';
import cool from 'cool-ascii-faces'
//Here is the app to create server and api
const app = express();
const PORT = process.env.PORT || 3000;

//To connect sql database 
// db.connect((err)=>{
//     if(err){
//         throw err;
//     }
//     console.log('MySql connected...')
// })
// db;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use('/table',tables);
app.use('/admin',admin);
app.use('/customer',customer);

app.get('/', (req, res) => {
  res.send('Hello World!')
});
// db.end();
app.get('/cool',(req,res)=>res.send(cool()))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
