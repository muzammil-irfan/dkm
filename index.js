import express from 'express';
//It will led app to process env variables
import 'dotenv/config';
import tables from './routes/tables.js';
import admin from './routes/admin.js';
import customer from './routes/customer.js';
import location from './routes/location.js';
import user from './routes/user.js';
import ticket from './routes/ticket.js';
import dkm_ticket from './routes/dkm_ticket.js';
import bodyParser from 'body-parser';
//Here is the app to create server and api
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
  next()
})
app.use('/table',tables);
app.use('/admin',admin);
app.use('/customer',customer);
app.use('/location',location);
app.use('/user',user);
app.use('/ticket',ticket);
app.use('/dkm_ticket',dkm_ticket);

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get("*",(req,res)=>{
  res.status(404).send("Not found");
})
app.listen(PORT, () => {
  console.log(`DKM app listening on port ${PORT}`);
});
