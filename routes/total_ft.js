import  { Router } from "express";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
const secret = "nodejs";
const router = Router();

router.get("/", (req, res) => {
  try {
    const sql = "SELECT location,total_ft FROM ticket INNER JOIN location ON ticket.location=location.location_id";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
