import  { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
const secret = "nodejs";
const router = Router();

router.get("/", (req, res) => {
  try {
    const sql = "SELECT * FROM customer";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        const resultData = result.map(item=>{
          return {
            id:item.customer_id,
            name:item.customer_name,
            address:item.customer_address
          }
        })
        res.status(200).json(resultData);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", (req, res) => {
  try {
    if (req.body.name === undefined || req.body.address === undefined) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      const obj = {
        customer_name: req.body.name,
        customer_address: req.body.address,
      };
      const sql = "INSERT INTO customer SET ?";
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(200).json({ message: "Customer added successfully" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/edit/:id", (req, res) => {
  try {
    if (req.body.name !== undefined || req.body.address !== undefined) {
      // const emailSql = `SELECT `
      const sql = `UPDATE customer SET ? WHERE customer_id='${req.params.id}'`;
      const obj = {};
      if (req.body.name !== undefined) {
        obj["customer_name"] = req.body.name;
      }
      if (req.body.address !== undefined) {
        obj["customer_address"] = req.body.address;
      }
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
            if(result.affectedRows === 1){
                res.status(200).json({ message: "Customer updated successfully" });
            } else {
                res.status(400).json({message:"Customer not found"});
            }
        }
      });
    } else {
      res.status(404).json({ message: "Credentials not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", (req, res) => {
  try {
    const sql = `DELETE FROM customer WHERE customer_id='${req.params.id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        if(result.affectedRows === 1){
            res.status(200).json({ message: "Customer deleted successfully" });
        } else {
            res.status(400).json({message:"Customer not found"});
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
