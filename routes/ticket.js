import { Router } from "express";
import db from "../libs/db.js";
import multer from "multer";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multerS3 from "multer-s3";
const router = Router();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new S3Client({ region });

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log("key", file);
      const extArr = file.mimetype.split("/");
      const ext = extArr[extArr.length - 1];
      cb(null, `${Date.now().toString()}.${ext}`);
    },
  }),
});

router.get("/", (req, res) => {
  try {
    const sql = "SELECT * FROM ticket";
    db.query(sql, (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/image/:key", async (req, res) => {
  const key = req.params.key;
  const cmd = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });

  console.log(url);
  res.send(url);
  // readStream.pipe(res);
  // res.send("hello");
});

// router.post("/image-multer", upload.single("image"), async (req, res) => {
//   const file = req.file;
//   console.log(file);
//   const result = await uploadFile(file);
//   console.log(result);
//   res.json({ imagePath: `/images/${result.Key}` });
// });

const backendHost = "localhost:3000/ticket";
router.post(
  "/image-multers3",
  upload.fields([
    { name: "truck_image", maxCount: 1 },
    { name: "trailer_image", maxCount: 1 },
  ]),
  (req, res) => {
    const truck_image = req.files.truck_image[0].key;
    const trailer_image = req.files.trailer_image[0].key;
    console.log(truck_image, trailer_image);
    res.send("done");
    // res.json({ imagePath: `/images/${file.key}` });
  }
);


router.post(
  "/add",
  upload.fields([
    { name: "truck_image", maxCount: 1 },
    { name: "trailer_image", maxCount: 1 },
  ])
  ,(req, res) => {
  try {
    // if (req.body.name === undefined) {
    //   res.status(404).json({ message: "credentials not found" });
    // } else {
      const truck_image = req.files.truck_image[0].key;
      const trailer_image = req.files.trailer_image[0].key;
      const obj = {
        shipped_to: req.body.shipped_to,
        date: req.body.date,
        location: req.body.location,
        customer_po: req.body.customer_po,
        pipe_size: req.body.pipe_size,
        wall: req.body.wall,
        weight: req.body.weight,
        end_finish: req.body.end_finish,
        ranges: req.body.ranges,
        conditions: req.body.conditions,
        pcs_ft: req.body.pcs_ft,
        pcs_in: req.body.pcs_in,
        pcs_notes: req.body.pcs_notes,
        recap: req.body.recap,
        total: req.body.total,
        driver_signature_pad: req.body.driver_signature_pad,
        truck_number: req.body.truck_number,
        truck_company: req.body.truck_company,
        trailer_number: req.body.trailer_number,
        truck_image: truck_image,
        trailer_image: trailer_image,
        terms_and_condition: req.body.terms_and_condition,
      };
      const sql = "INSERT INTO ticket SET ?";
      db.query(sql, obj, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(200).json({ message: "Ticket added successfully" });
        }
      });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
