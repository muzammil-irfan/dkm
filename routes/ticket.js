import { Router } from "express";
import db from "../libs/db.js";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
const router = Router();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;

const s3 = new S3Client({ region });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const extArr = file.mimetype.split("/");
      const ext = extArr[extArr.length - 1];
      cb(null, `${Date.now().toString()}.${ext}`);
    },
    acl:"public-read"
  }),
});


router.get("/", (req, res) => {
  try {
    const sql = "SELECT * FROM ticket LEFT JOIN user ON ticket.user=user.user_id LEFT JOIN location ON ticket.location=location.location_id LEFT JOIN customer ON ticket.customer=customer.customer_id LEFT JOIN pcs ON ticket.pcs=pcs.pcs_id";
    db.query(sql, async (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        if (result.length > 0) {
          const urlCreator = (key)=>{
            return `https://${bucketName}.s3.amazonaws.com/${key}`;
          }
          let resultData = result.map((item) => {
              const truck_image_url = urlCreator(item.truck_image);
              const trailer_image_url = urlCreator(item.trailer_image);
              const driver_signature_url = urlCreator(item.driver_signature);
              return {
                ticket_id:item.ticket_id,
                user:{
                  id:item.user_id,
                  name:item.name,
                  email:item.email,
                  status:item.status
                },
                customer:{
                  id:item.customer_id,
                  name:item.customer_name,
                  address:item.customer_address
                },
                dkm_number:item.dkm_number,
                date:item.date,
                location:{
                  id:item.location_id,
                  name:item.location_name
                },
                customer_po:item.customer_po,
                pipe_size:item.pipe_size,
                wall:item.wall,
                weight_ft:item.weight_ft,
                end_finish:item.end_finish,
                ranges:item.ranges,
                conditions:item.conditions,
                ticket_number:item.ticket_number,
                total_ft:item.total_ft,
                pcs:{
                  id:item.pcs_id,
                  ft:item.pcs_ft,
                  in:item.pcs_in,
                  notes:item.pcs_notes
                },
                truck_number:item.truck_number,
                truck_company:item.truck_company,
                trailer_number:item.trailer_number,
                driver_signature:driver_signature_url,
                truck_image:truck_image_url,
                trailer_image:trailer_image_url
              };
            })
          res.status(200).json(resultData);
        } else {
          res.status(200).json(result);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(`/user/:id`, (req, res) => {
  try {
    const sql = `SELECT * FROM ticket LEFT JOIN user ON ticket.user=user.user_id LEFT JOIN location ON ticket.location=location.location_id LEFT JOIN customer ON ticket.customer=customer.customer_id LEFT JOIN pcs ON ticket.pcs=pcs.pcs_id  WHERE user='${req.params.id}'`;
    db.query(sql, async (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        if (result.length > 0) {
          const urlCreator = (key)=>{
            return `https://${bucketName}.s3.amazonaws.com/${key}`;
          }
          let resultData = result.map((item) => {
              const truck_image_url = urlCreator(item.truck_image);
              const trailer_image_url = urlCreator(item.trailer_image);
              const driver_signature_url = urlCreator(item.driver_signature);
              return {
                ticket_id:item.ticket_id,                
                user:{
                  id:item.user_id,
                  name:item.name,
                  email:item.email,
                  status:item.status
                },
                customer:{
                  id:item.customer_id,
                  name:item.customer_name,
                  address:item.customer_address
                },
                dkm_number:item.dkm_number,
                data:item.date,
                location:{
                  id:item.location_id,
                  name:item.location_name
                },
                customer_po:item.customer_po,
                pipe_size:item.pipe_size,
                wall:item.wall,
                weight_ft:item.weight_ft,
                end_finish:item.end_finish,
                ranges:item.ranges,
                conditions:item.conditions,
                ticket_number:item.ticket_number,
                total_ft:item.total_ft,
                pcs:{
                  id:item.pcs_id,
                  ft:item.pcs_ft,
                  in:item.pcs_in,
                  notes:item.pcs_notes
                },
                truck_number:item.truck_number,
                truck_company:item.truck_company,
                trailer_number:item.trailer_number,
                driver_signature:driver_signature_url,
                truck_image:truck_image_url,
                trailer_image:trailer_image_url
              };
            })
          res.status(200).json(resultData);
        } else {
          res.status(200).json(result);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/",upload.single("image"),(req,res)=>{
  try{
    console.log(req.file);
    res.send("ok")
  } catch(err){
    res.status(500).json({ message: error.message });
  }
})
router.post(
  "/add",
  upload.fields([
    { name: "truck_image", maxCount: 1 },
    { name: "trailer_image", maxCount: 1 },
    { name: "driver_signature", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      // if(match){
      //   res.status(404).json({ message: "credentials not found" });
      // } else {
      const truck_image = req.files.truck_image[0].key;
      const trailer_image = req.files.trailer_image[0].key;
      const driver_signature = req.files.driver_signature[0].key;
      const ticketObj = {
        user:req.body.user,
        customer:req.body.customer,
        dkm_number:req.body.dkm_number,
        date: req.body.date.toString(),
        location: req.body.location,
        customer_po: req.body.customer_po,
        pipe_size: req.body.pipe_size,
        wall: req.body.wall,
        weight_ft: req.body.weight_ft,
        end_finish: req.body.end_finish,
        ranges: req.body.ranges,
        conditions: req.body.conditions,
        total_ft: req.body.total_ft,
        ticket_number:req.body.ticket_number,
        truck_number: req.body.truck_number,
        truck_company: req.body.truck_company,
        trailer_number: req.body.trailer_number,
        driver_signature: driver_signature,
        truck_image: truck_image,
        trailer_image: trailer_image  
      };
      const pcsObj = {
        pcs_ft:req.body.pcs_ft,
        pcs_in:req.body.pcs_in,
        pcs_notes:req.body.pcs_notes
      };
      const pcsSql = "INSERT INTO pcs SET ?";
      db.query(pcsSql,pcsObj,(err,pcsResult)=>{
        if(err){
          res.status(400).json({ message: err.message });
        } else {
          ticketObj['pcs'] = pcsResult.insertId;
          const ticketSql = "INSERT INTO ticket SET ?";
          db.query(ticketSql, ticketObj, (err, result) => {
            if (err) {
              res.status(400).json({ message: err.message });
            } else {
              res.status(200).json({ message: "Ticket added successfully" });
            }
          });
        }
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
