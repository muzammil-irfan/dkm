import express from 'express';
//It will led app to process env variables
import 'dotenv/config';
import tables from './routes/tables.js';
import admin from './routes/admin/index.js';
import adminLogin from './routes/admin/login.js';
import customer from './routes/customer.js';
import location from './routes/location.js';
import user from './routes/user/index.js';
import login from './routes/user/login.js';
import ticket from './routes/ticket.js';
import total_ft from './routes/total_ft.js';
import customer_order from './routes/customer_order.js';
import forget_password from './routes/forget_password.js';
import dkm_ticket from './routes/dkm_ticket.js';
import bodyParser from 'body-parser';
import path from 'path';
import ejs from 'ejs';
import cors from 'cors';
import { url } from 'inspector';
//Here is the app to create server and api
const app = express();
const PORT = process.env.PORT || 3000;
const webPath = new URL("web",import.meta.url).pathname.slice(1);
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
  next()
});
app.engine('html',ejs.renderFile);
app.use(express.static(webPath));
app.set("views",webPath);
app.use('/api/table',tables);
app.use('/api/admin',admin);
app.use('/api/admin/login',adminLogin);
app.use('/api/customer',customer);
app.use('/api/location',location);
app.use('/api/user',user);
app.use('/api/user/login',login);
app.use('/api/user/forget',forget_password);
app.use('/api/ticket',ticket);
app.use('/api/dkm_ticket',dkm_ticket);
app.use('/api/total_ft',total_ft);
app.use('/api/customer_order',customer_order);
console.log(new URL("web",import.meta.url).pathname.slice(1));
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
