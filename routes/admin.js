import e, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../libs/db.js";
// const secret = proces.env.JWT_SECRET;
const secret = "nodejs";
const router = Router();
router.get("/get",(req,res)=>{
  let sql = 'SELECT * FROM admin';
  db.query(sql,(err,result)=>{
    if(err){
      res.status(400).json({message:err.message});
    } else{
      res.json(result);
    }
  })
})
router.post("/signup", async (req, res) => {
  try {
    if (
      req.body.name === undefined ||
      req.body.email === undefined ||
      req.body.password === undefined
    ) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      if(req.body.password.length < 6){
        res.status(400).json({message:"Password cannot be less than 6"});
      } else {
        let emailSql = `SELECT email FROM admin WHERE email='${req.body.email}'`;
        db.query(emailSql, (err, emailResult) => {
          if (err) {
            res.status(500).json({ message: err.message });
          } else {
            //if greater then it has found an email in database
            if (emailResult.length > 0) {
              res.status(401).json({ message: "Email already exist" });
            } else {
              let sql = "INSERT INTO admin SET ?";
              const password = bcrypt.hashSync(req.body.password, 10);
              const obj = {
                name: req.body.name,
                email: req.body.email,
                password: password,
              };
              db.query(sql, obj, (err) => {
                if (err) {
                  res.status(400).json({ message: err.message });
                } else {
                  res.status(201).json({ message: "Admin created successfully" });
                }
              });
            }
          }
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", (req, res) => {
  try {
    if (req.body.email === undefined || req.body.password === undefined) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      
        let sql = `SELECT * FROM admin WHERE email = '${req.body.email}'`;
        db.query(sql, async (err, result) => {
          if (err) {
            res.status(401).json({ message: "Wrong credentials" });
          } else {
            if (result.length > 0) {
              const match = await bcrypt.compare(
                req.body.password.toString(),
                result[0].password
              );
              if (match) {
                jwt.sign(JSON.stringify(result[0]), secret, (err, token) => {
                  if (err) {
                    res.status(500).json({ message: err.message });
                  } else {
                    res
                      .status(202)
                      .json({ token, message: "Login successfully" });
                  }
                });
              } else {
                res.status(401).json({ message: "Wrong credentials" });
              }
            } else {
              res.status(404).json({ message: "email not found" });
            }
          }
        });
      
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/updatepassword", (req, res) => {
  try {
    if (
      req.body.email === undefined ||
      req.body.oldPassword === undefined ||
      req.body.newPassword === undefined 
    ) {
      res.status(404).json({ message: "Credentials not found" });
    } else {
      if(req.body.newPassword.length < 6){
        res.status(400).json({message:"Password cannot be less than 6"});
      } else {
        let emailSql = `SELECT * FROM admin WHERE email = '${req.body.email}'`;
        db.query(emailSql, async (err, emailResult) => {
          if (err) {
            res.status(401).json({ message: "Wrong credentials" });
          } else {
            if (emailResult.length > 0) {
              const match = await bcrypt.compare(
                req.body.oldPassword.toString(),
                emailResult[0].password
              );
              if (match) {
                const newEncryptPassword = await bcrypt.hashSync(req.body.newPassword,10);
                const updateSql = `UPDATE admin SET password='${newEncryptPassword}' WHERE email = '${req.body.email}'`;
                db.query(updateSql, (updateErr, updateResult) => {
                  if (updateErr) {
                    res
                      .status(501)
                      .json({
                        message: "Unable to update password. Please try again",
                      });
                  } else {
                    res
                      .status(200)
                      .json({ message: "Password Updated successfully" });
                  }
                });
              } else {
                res.status(401).json({ message: "Wrong credentials" });
              }
            } else {
              res.status(404).json({ message: "email not found" });
            }
          }
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;