import  { Router } from "express";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
const secret = "nodejs";
const router = Router();

router.get("/", (req, res) => {
  try {
    const sql = "SELECT * FROM location";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        const resultData = result.map(item=>{
          return{
            id:item.location_id,
            name:item.location_name
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
    if (req.body.name === undefined ) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      const obj = {
        location_name: req.body.name
      };
      const sql = "INSERT INTO location SET ?";
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(200).json({ message: "Location added successfully" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/edit/:id", (req, res) => {
  try {
    if (req.body.name !== undefined) {
      const sql = `UPDATE location SET ? WHERE location_id='${req.params.id}'`;
      const obj = {
        location_name:req.body.name
      };
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
            if(result.affectedRows === 1){
                res.status(200).json({ message: "Location updated successfully" });
            } else {
                res.status(400).json({message:"Location not found"});
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
    const sql = `DELETE FROM location WHERE location_id='${req.params.id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        if(result.affectedRows === 1){
            res.status(200).json({ message: "Location deleted successfully" });
        } else {
            res.status(400).json({message:"Location not found"});
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
