import express from 'express';
//It will led app to process env variables
import 'dotenv/config';
import tables from './routes/tables.js';
import admin from './routes/admin.js';
import customer from './routes/customer.js';
import location from './routes/location.js';
import user from './routes/user.js';
import ticket from './routes/ticket.js';
import total_ft from './routes/total_ft.js';
import customer_order from './routes/customer_order.js';
import forget_password from './routes/forget_password.js';
import dkm_ticket from './routes/dkm_ticket.js';
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';
import cors from 'cors';
//Here is the app to create server and api
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
  next()
});
app.engine('html',ejs.renderFile);
app.use(express.static(path.join(__dirname, "web").replace(/\\/g, '/')));
app.set("views",path.join(__dirname, "web").replace(/\\/g, '/'));
app.use('/api/table',tables);
app.use('/api/admin',admin);
app.use('/api/customer',customer);
app.use('/api/location',location);
app.use('/api/user',user);
app.use('/api/user/forget',forget_password);
app.use('/api/ticket',ticket);
app.use('/api/dkm_ticket',dkm_ticket);
app.use('/api/total_ft',total_ft);
app.use('/api/customer_order',customer_order);

app.get("/api/",(req,res)=>{  
  res.send("<h2>Api is working perfectly</h2>");
});

app.get('/*', (req, res) => {
  res.render('index.html');
});
app.get("*",(req,res)=>{
  res.status(404).send("Not found");
})
app.listen(PORT, () => {
  console.log(`DKM server listening on port ${PORT}`);
});
