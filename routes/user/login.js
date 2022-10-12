import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../libs/db.js";
const secret = process.env.JWT_SECRET;
import randomstring from "randomstring";
import nodemailer from "nodemailer";
// const secret = "nodejs";
const router = Router();
const statusKeys = ["pending", "approved", "rejected"];

router.post("/", (req, res) => {
  try {
    if (req.body.email === undefined || req.body.password === undefined) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      if (req.body.password.length < 6) {
        res.status(400).json({ message: "Password cannot be less than 6" });
      } else {
        let sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
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
                /* This will create code and send token to database to verify later and send email to the user */
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
                            to: req.body.email,
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

router.post("/resend", (req, res) => {
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
          } else {
            //If email found then create code and send the token to the database and email the code to the user email
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
                      res
                        .status(400)
                        .json({
                          message: "Token not sended. Please try again",
                        });
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
                        to: req.body.email,
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
  } catch (err) {
    res.status(500).json({ message: err.message });
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
            const { token, status } = emailResult[0];
            if (token == null) {
              res.status(404).json({ message: "Code not found" });
            } else {
              jwt.verify(token, secret, (err, code) => {
                if (err) {
                  res.status(400).json({ message: err.message });
                } else {
                  if (code === req.body.code) {
                    /* This will check status and give message according to that */
                    if (status !== statusKeys[1]) {
                      if (status === statusKeys[0]) {
                        res
                          .status(401)
                          .json({ message: "you are not approved yet" });
                      } else {
                        res.status(401).json({ message: "Rejected" });
                      }
                    } else {
                      const userObject = {
                        user_id: emailResult[0].user_id,
                        email: emailResult[0].email
                      };
                      res
                        .status(202)
                        .json({ ...userObject, message: "Login successfully" });
                    }
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
