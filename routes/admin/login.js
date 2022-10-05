import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../libs/db.js";
import randomstring from "randomstring";
import nodemailer from "nodemailer";
const secret = process.env.JWT_SECRET;
// const secret = "nodejs";
const router = Router();

router.post("/", (req, res) => {
  try {
    if (
      req.body.email === undefined ||
      req.body.password === undefined ||
      req.body.pin === undefined
    ) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      if (
        req.body.password.length < 6 ||
        typeof req.body.pin !== "number" ||
        req.body.pin.toString().length < 4
      ) {
        if (typeof req.body.pin !== "number") {
          res.status(400).json({ message: "Pin can only be a number" });
        } else if (req.body.pin.toString().length < 4) {
          res.status(400).json({ message: "Pin cannot be less than 4" });
        } else {
          res.status(400).json({ message: "Password cannot be less than 6" });
        }
      } else {
        let sql = `SELECT * FROM admin WHERE email = '${req.body.email}'`;
        db.query(sql, async (err, result) => {
          if (err) {
            res.status(401).json({ message: "Wrong credentials" });
          } else {
            if (result.length > 0) {
              if (req.body.pin !== result[0].pin) {
                res.status(401).json({ message: "Wrong credentials" });
              } else {
                const match = await bcrypt.compare(
                  req.body.password.toString(),
                  result[0].password
                );
                if (match) {
                  /* This will create code and send token to database to verify later and send email to the user */
                const code = randomstring.generate({
                  length: 6,
                  charset: "numeric",
                });
                jwt.sign(code.toString(), secret, (err, token) => {
                  if (err) {
                    res.status(400).json({ message: err.message });
                  } else {
                    const adminSql = `UPDATE admin SET ? WHERE email='${req.body.email}'`;
                    const adminObj = {
                      token,
                    };
                    db.query(adminSql, adminObj, (err, adminResult) => {
                      if (err) {
                        res.status(400).json({ message: err.message });
                      } else {
                        if (adminResult.affectedRows == 0) {
                          res.status(400).json({ message: err.message });
                        } else {
                          const transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                              user: process.env.USER_GMAIL,
                              pass: process.env.USER_GMAIL_PASSWORD,
                            },
                          });
                          const mailOptions = {
                            from: process.env.USER_GMAIL,
                            to:  process.env.ADMIN_EMAIL,
                            subject: `Authentication code for admin`,
                            text: `${code}`,
                          };
                          transporter.sendMail(mailOptions, (err, mailRes) => {
                            if (err) {
                              res.status(400).json({ message: err.message });
                            } else {
                              res
                                .status(200)
                                .json({ message: "Code sended successfully" });
                            }
                          });
                        }
                      }
                    });
                  }
                });
                  
                } else {
                  res.status(401).json({ message: "Wrong credentials" });
                }
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

router.post("/verify", (req, res) => {
  try {
    if (req.body.email === undefined || req.body.code === undefined) {
      res.status(404).json({ message: "Credentials not found" });
    } else {
      const emailSql = `SELECT * FROM admin WHERE email='${req.body.email}'`;
      db.query(emailSql, (err, emailResult) => {
        if (err) {
          res.status(404).json({ message: err.message });
        } else {
          if (emailResult.length == 0) {
            res.status(404).json({ message: "Email not found" });
          } else {
            const { token } = emailResult[0];
            if (token == null) {
              res.status(404).json({ message: "Code not found" });
            } else {
              jwt.verify(token, secret, (err, code) => {
                if (err) {
                  res.status(400).json({ message: err.message });
                } else {
                  if (code === req.body.code) {
                    jwt.sign(JSON.stringify(emailResult[0]), secret, (err, token) => {
                      if (err) {
                        res.status(500).json({ message: err.message });
                      } else {
                        res
                          .status(202)
                          .json({ token, message: "Login successfully" });
                      }
                    });
                  } else {
                    res.status(400).json({ message: "Code not valid" });
                  }
                }
              });
            }
          }
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
