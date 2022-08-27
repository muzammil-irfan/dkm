import express from 'express';
//It will led app to process env variables
import 'dotenv/config';
import './libs/db.js';
import tables from './routes/tables.js';
import admin from './routes/admin.js';
import bodyParser from 'body-parser'
//Here is the app to create server and api
const app = express();
const port = 3000;

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

app.get('/', (req, res) => {
  res.send('Hello World!')
});
// db.end();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
