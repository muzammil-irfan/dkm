import express from 'express';

const router = express.Router();

router.get('/admin',(req,res)=>{
    let sql = `CREATE TABLE 
        admin(id int AUTO_INCREMENT, 
        name VARCHAR(255), 
        email VARCHAR(255) UNIQUE NOT NULL , 
        password VARCHAR(255) NOT NULL, 
        PRIMARY KEY (id))`;
    db.query(sql,(err)=>{
        if(err){
            res.status(400).json({message:err.message});
            return;
        }
        res.status(201).json({message:'Table created successfully'});
    });
});


export default router;