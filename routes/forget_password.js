import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
import randomstring from 'randomstring';
const secret = "nodejs";
const router = Router();

router.get("/forget", (req, res) => {
    let sql = "SELECT * FROM user";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.json(result);
      }
    });
});

export default router;