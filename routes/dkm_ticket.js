import  { Router } from "express";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
const secret = "nodejs";
const router = Router();

router.get("/", (req, res) => {
  try {
    const sql = "SELECT * FROM dkm_ticket WHERE id='1'";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        const {dkm, ticket} = result[0];
        const obj = {
            dkm, ticket
        }
        res.status(200).json(obj);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/dkm", (req, res) => {
  try {
    if (req.body.dkm !== undefined) {
      const sql = `UPDATE dkm_ticket SET ? WHERE id='1'`;
      const obj = {
        dkm:req.body.dkm
      };
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
            if(result.affectedRows === 1){
                res.status(200).json({ message: "DKM number updated successfully" });
            } else {
                res.status(400).json({message:"DKM number not updated"});
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

router.put("/update/ticket", (req, res) => {
  try {
    if (req.body.ticket !== undefined) {
      const sql = `UPDATE dkm_ticket SET ? WHERE id='1'`;
      const obj = {
        ticket:req.body.ticket
      };
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
            if(result.affectedRows === 1){
                res.status(200).json({ message: "Ticket number updated successfully" });
            } else {
                res.status(400).json({message:"Ticket number not updated"});
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


export default router;
