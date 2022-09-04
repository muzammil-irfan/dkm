import express from "express";
import db from "../libs/db.js";
const router = express.Router();

router.get("/admin", (req, res) => {
  let sql = `CREATE TABLE 
        admin(id int AUTO_INCREMENT, 
        name VARCHAR(255), 
        email VARCHAR(255) UNIQUE NOT NULL , 
        password VARCHAR(255) NOT NULL, 
        pin int NOT NULL,
        PRIMARY KEY (id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(201).json({ message: "Table created successfully" });
  });
});
// router.get('/updateuser',(req,res)=>{
//     let sql = `DROP TABLE user`;
//     db.query(sql,(err)=>{
//         if(err){
//             res.status(400).json({message:err.message});
//         }else {
//             res.status(201).json({message:'Table dropped successfully'});
//         }
//     });
// });
router.get("/customer", (req, res) => {
  let sql = `CREATE TABLE 
    customer(id int AUTO_INCREMENT, 
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    PRIMARY KEY (id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ message: "Table created successfully" });
    }
  });
});

router.get("/location",(req,res)=>{
  const sql = `CREATE TABLE 
  location(id int AUTO_INCREMENT,
  name TEXT NOT NULL,
  PRIMARY KEY (id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ message: "Table created successfully" });
    }
  });
})

router.get("/user",(req,res)=>{
  const sql = `CREATE TABLE 
        user(id VARCHAR(255) NOT NULL, 
        name VARCHAR(255), 
        email VARCHAR(255) UNIQUE NOT NULL , 
        password VARCHAR(255) NOT NULL, 
        status VARCHAR(255) NOT NULL DEFAULT 'pending',
        PRIMARY KEY (id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(201).json({ message: "Table created successfully" });
  });
});
router.get("/ticket",(req,res)=>{
  const sql = `CREATE TABLE 
        ticket(id int AUTO_INCREMENT, 
        shipped_to VARCHAR(255) NOT NULL, 
        date DATE NOT NULL, 
        location VARCHAR(255) NOT NULL, 
        customer_po VARCHAR(255) NOT NULL , 
        pipe_size VARCHAR(255) NOT NULL, 
        wall VARCHAR(255) NOT NULL,
        weight VARCHAR(255) NOT NULL,
        end_finish VARCHAR(255) NOT NULL,
        ranges VARCHAR(255) NOT NULL,
        conditions VARCHAR(255) NOT NULL,
        pcs_ft VARCHAR(255) NOT NULL,
        pcs_in VARCHAR(255) NOT NULL,
        pcs_notes VARCHAR(255) ,
        recap VARCHAR(255) NOT NULL,
        total VARCHAR(255) NOT NULL,
        driver_signature_pad VARCHAR(255) NOT NULL,
        truck_number int NOT NULL,
        truck_company VARCHAR(255) NOT NULL,
        trailer_number int NOT NULL,
        truck_image VARCHAR(255),
        trailer_image VARCHAR(255) NOT NULL,
        terms_and_condition VARCHAR(255) NOT NULL,
        PRIMARY KEY (id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(201).json({ message: "Table created successfully" });
  });
});

export default router;
