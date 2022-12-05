const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cors = require('cors');
// const path=require('path');
const dotenv= require('dotenv');
dotenv.config({path:'./config.env'});
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors())
// app.use(express.static(path.join(__dirname,'./client/build')))

// app.get("/",()=>(req,res)=>{
//   res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })

// app.get("/admin",()=>(req,res)=>{
//   res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })

const mongoURI =process.env.MONGO || "mongodb://localhost:27017/cybervie"
const conn = mongoose.createConnection(mongoURI)
var gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      metadata: req.body,
      bucketName: 'uploads'
    };
  }
})
const up = multer();

const upload = multer({ storage });

app.get('/api/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404)
    }

    // Files exist
    return res.json(files);
  });
});
app.get('/api/get',(req,res)=>{
  res.send("hello");
})
// app.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json(req.body);
})

app.listen(port, () => {
  console.log(`backend started on port ${port}`)
})