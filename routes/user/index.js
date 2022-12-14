import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../../libs/db.js";
const secret = process.env.JWT_SECRET;
import randomstring from "randomstring"
// const secret = "nodejs";
const router = Router();
const statusKeys = ["pending", "approved", "rejected"];

router.get("/", (req, res) => {
  let sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      const data = result.map(item=>{
        return {
          user_id: item.user_id,
          name: item.name,
          email: item.email,
          status: item.status
        };
      })
      res.json(data);
    }
  });
});

router.get("/ticket", (req, res) => {
  let userSql = "SELECT * FROM user";
  db.query(userSql, (err, userResult) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      const ticketSql = "SELECT user FROM ticket";
      db.query(ticketSql, (err, ticketResult) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          const data = userResult.map((item) => {
            const obj = {
              user_id: item.user_id,
              name: item.name,
              email: item.email,
              status: item.status
            }; 
            obj["ticket"] = 0;
            ticketResult.map((ticketItem) => {
              if (ticketItem.user === obj.user_id) {
                obj["ticket"] += 1;
              }
            });
            return obj;
          });
          res.json(data);
        }
      });
    }
  });
});

router.get("/status", (req, res) => {
  res.status(200).json(statusKeys);
});
router.get("/:id", (req, res) => {
  let sql = `SELECT user_id,name,email,status FROM user WHERE user_id='${req.params.id}'`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.json(result);
    }
  });
});

router.post("/signup", async (req, res) => {
  try {
    if (
      req.body.name === undefined ||
      req.body.email === undefined ||
      req.body.password === undefined
    ) {
      res.status(404).json({ message: "credentials not found" });
    } else {
      if (
        req.body.password.length < 6 ||
        !req.body.email.includes("@") ||
        !req.body.email.includes(".")
      ) {
        if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
          res.status(400).json({ message: "Email format is not correct" });
        } else {
          res.status(400).json({ message: "Password cannot be less than 6" });
        }
      } else {
        let emailSql = `SELECT email FROM user WHERE email='${req.body.email}'`;
        db.query(emailSql, (err, emailResult) => {
          if (err) {
            res.status(500).json({ message: err.message });
          } else {
            //if greater then it has found an email in database
            if (emailResult.length > 0) {
              res.status(401).json({ message: "Email already exist" });
            } else {
              let sql = "INSERT INTO user SET ?";
              const password = bcrypt.hashSync(req.body.password, 10);
              const obj = {
                user_id: randomstring.generate(24).toLowerCase(),
                name: req.body.name,
                email: req.body.email,
                password: password,
              };
              db.query(sql, obj, (err) => {
                if (err) {
                  res.status(400).json({ message: err.message });
                } else {
                  res
                    .status(201)
                    .json({ message: "User created successfully" });
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

router.post("/updatepassword", (req, res) => {
  try {
    if (
      req.body.email === undefined ||
      req.body.oldPassword === undefined ||
      req.body.newPassword === undefined
    ) {
      res.status(404).json({ message: "Credentials not found" });
    } else {
      if (req.body.newPassword.length < 6) {
        res.status(400).json({ message: "Password cannot be less than 6" });
      } else {
        let emailSql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
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
                const newEncryptPassword = await bcrypt.hashSync(
                  req.body.newPassword,
                  10
                );
                const updateSql = `UPDATE user SET password='${newEncryptPassword}' WHERE email = '${req.body.email}'`;
                db.query(updateSql, (updateErr, updateResult) => {
                  if (updateErr) {
                    res.status(501).json({
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

router.put("/edit/:id", (req, res) => {
  try {
    if (
      req.body.name !== undefined ||
      req.body.email !== undefined ||
      req.body.password !== undefined ||
      req.body.status !== undefined
    ) {
      const sql = `UPDATE user SET ? WHERE user_id='${req.params.id}'`;
      const obj = {};
      if (req.body.name !== undefined) {
        obj["name"] = req.body.name;
      }
      if (req.body.email !== undefined) {
        obj["email"] = req.body.email;
      }
      let allowed = true;

      if (req.body.status !== undefined) {
        switch (req.body.status) {
          case statusKeys[0]:
            obj["status"] = statusKeys[0];
            break;
          case statusKeys[1]:
            obj["status"] = statusKeys[1];
            break;
          case statusKeys[2]:
            obj["status"] = statusKeys[2];
            break;
          default:
            allowed = false;
            break;
        }
      }
      if (allowed) {
        db.query(sql, obj, (err, result) => {
          if (err) {
            res.status(400).json({ message: err.message });
          } else {
            if (result.affectedRows === 1) {
              res.status(200).json({ message: "User updated successfully" });
            } else {
              res.status(400).json({ message: "User not found" });
            }
          }
        });
      } else {
        res.status(400).json({ message: "Status is not valid" });
      }
    } else {
      res.status(404).json({ message: "Credentials not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
