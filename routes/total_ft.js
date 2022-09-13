import { Router } from "express";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
const secret = "nodejs";
const router = Router();

router.get("/", (req, res) => {
  try {
    const sql =
      "SELECT location,location_name,total_ft FROM ticket LEFT JOIN location ON ticket.location=location.location_id";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        if (result.length > 0) {
          const data = [];
          result.map((resultItem) => {
            let match = false;
            let index = 0;
            if (data.length > 0) {
              data.map((dataItem, index) => {
                if (resultItem.location == dataItem.location) {
                  match = true;
                  index = index;
                }
              });
            }
            if (match) {
              data[index].total_ft += resultItem.total_ft;
            } else {
              data.push(resultItem);
            }
          });
          res.status(200).json(data);
        } else {
          res.status(200).json(result);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
