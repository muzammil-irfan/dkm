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
    customer(customer_id int AUTO_INCREMENT, 
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    PRIMARY KEY (customer_id))`;
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
  location(location_id int AUTO_INCREMENT,
  location_name TEXT NOT NULL,
  PRIMARY KEY (location_id))`;
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
        user(user_id VARCHAR(255) NOT NULL, 
        name VARCHAR(255), 
        email VARCHAR(255) UNIQUE NOT NULL , 
        password VARCHAR(255) NOT NULL, 
        status VARCHAR(255) NOT NULL DEFAULT 'pending',
        token TEXT,
        PRIMARY KEY (user_id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(201).json({ message: "Table created successfully" });
  });
});

router.get("/pcs",(req,res)=>{
  const sql = `CREATE TABLE 
        pcs(pcs_id int AUTO_INCREMENT, 
        pcs_ft int, 
        pcs_in int,
        pcs_notes VARCHAR(255),
        PRIMARY KEY (pcs_id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(201).json({ message: "Table created successfully" });
  });
  
})

router.get("/ticket",(req,res)=>{
  const sql = `CREATE TABLE 
        ticket(ticket_id int AUTO_INCREMENT, 
          user VARCHAR(255) NOT NULL,
          shipped_to VARCHAR(255) NOT NULL, 
          customer int NOT NULL,
          address VARCHAR(255) NOT NULL,
          dkm_number int NOT NULL, 
          date VARCHAR(255) NOT NULL, 
          location int NOT NULL,
          customer_po VARCHAR(255) NOT NULL , 
          pipe_size int NOT NULL, 
          wall int NOT NULL,
          weight_ft int NOT NULL,
          end_finish int NOT NULL,
          ranges int NOT NULL,
          conditions VARCHAR(255) NOT NULL,
          ticket_number int NOT NULL,
          total_ft int NOT NULL,
          pcs int NOT NULL,
          truck_number VARCHAR(255) NOT NULL,
          truck_company VARCHAR(255) NOT NULL,
          trailer_number VARCHAR(255) NOT NULL,
          driver_signature VARCHAR(255) NOT NULL,
          truck_image VARCHAR(255),
          trailer_image VARCHAR(255) NOT NULL,
          PRIMARY KEY (ticket_id),
          FOREIGN KEY (user) REFERENCES user(user_id),
          FOREIGN KEY (customer) REFERENCES customer(customer_id),
          FOREIGN KEY (location) REFERENCES location(location_id),
          FOREIGN KEY (pcs) REFERENCES pcs(pcs_id))`;
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.status(201).json({ message: "Table created successfully" });
  });
});

router.get("/dkm_ticket",(req,res)=>{
  const sql =  `CREATE TABLE 
                dkm_ticket(id int AUTO_INCREMENT, 
                dkm int,
                ticket int,
                PRIMARY KEY (id))`
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ message: "Table created successfully" });
    }
  });
})
router.get("/alterticket",(req,res)=>{
  const sql =  `ALTER TABLE 
                ticket DROP COLUMN shipped_to, DROP COLUMN address`
  db.query(sql, (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ message: "Table created successfully" });
    }
  });
})
export default router;
