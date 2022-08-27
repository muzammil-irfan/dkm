import { Router } from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signup', async (req,res)=>{
    let sql = 'INSERT INTO admin SET ?';
    // console.log(req.body.password)
    const password = bcrypt.hashSync(req.body.password,10);
    const obj = {
        name:req.body.name,
        email:req.body.email,
        password: password
    }
    db.query(sql,obj,(err)=>{
        if(err){
            res.status(400).json({message:err.message});
        }
        res.status(200).json({message:'Admin created successfully'});
    })
})

router.post('/login',(req,res)=>{
    let sql = `SELECT * FROM admin WHERE email = '${req.body.email}'`;
    db.query(sql,async(err,result)=>{
        if(err){
            res.status(401).json({message:'Wrong credentials'});
        } else{
            console.log(result[0].password)
            const match = await bcrypt.compare(req.body.password,result[0].password);
            if(match){
                jwt.sign(JSON.stringify(result[0]),process.env.JWT_SECRET,(err,token)=>{
                    if(err) throw err;
                    res.status(200).json({token,message:"Login successfully"});
                })
            }else{
                res.status(401).json({message:'Wrong credentials'});
            }
        }
    })
})

export default router;