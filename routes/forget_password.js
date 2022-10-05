import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../libs/db.js";
import randomstring from "randomstring";
const secret = process.env.JWT_SECRET;
const router = Router();
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
import nodemailer from "nodemailer";

router.post("/", (req, res) => {
  try {
    if (req.body.email === undefined) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      const emailSql = `SELECT * FROM user WHERE email='${req.body.email}'`;
      db.query(emailSql, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          if (result.length === 0) {
            res.status(404).json({ message: "Email not found" });
          } else {//If email found then create code and send the token to the database and email the code to the user email
            const code = randomstring.generate({
              length: 6,
              charset: "numeric",
            });
            jwt.sign(code.toString(), secret, (err, token) => {
              if (err) {
                res.status(400).json({ message: err.message });
              } else {
                const userSql = `UPDATE user SET ? WHERE email='${req.body.email}'`;
                const userObj = {
                  token,
                };
                db.query(userSql, userObj, (err, userResult) => {
                  if (err) {
                    res.status(400).json({ message: err.message });
                  } else {
                    if (userResult.affectedRows == 0) {
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
                        to: "muzammilirfa@gmail.com",
                        subject: `Authentication code`,
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
          }
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify", (req, res) => {
  try {
    if (req.body.email === undefined || req.body.code === undefined) {
      res.status(404).json({ message: "Credentials not found" });
    } else {
      const emailSql = `SELECT * FROM user WHERE email='${req.body.email}'`;
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
                    res
                      .status(200)
                      .json({
                        message:
                          "Code match successfully. Please create your new password",
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

router.post("/password", (req, res) => {
  try {
    if (req.body.email === undefined || req.body.password === undefined || req.body.password.length < 6) {
      if(req.body.password.length < 6){
        res.status(200).json({message:"Password cannot be less than 6"});
      } else {
        res.status(404).json({ message: "credentials not found" });
      }
    } else {
      const emailSql = `SELECT * FROM user WHERE email='${req.body.email}'`;
      db.query(emailSql, (err, emailResult) => {
        if (err) {
          res.status(404).json({ message: err.message });
        } else {
          if (emailResult.length == 0) {
            res.status(404).json({ message: "Email not found" });
          } else {
            const passwordSql = `UPDATE user SET ? WHERE email='${req.body.email}'`;
            const newPassword = bcrypt.hashSync(req.body.password, 10);
            const obj = {
              password: newPassword,
            };
            db.query(passwordSql, obj, (err, passwordResult) => {
              if (err) {
                res.status(400).json({ message: err.message });
              } else {
                if (passwordResult.affectedRows === 0) {
                  res
                    .status(400)
                    .json({
                      message: "Password not updated. Please try again.",
                    });
                } else {
                  res
                    .status(200)
                    .json({ message: "Password updated successfully" });
                }
              }
            });
          }
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
