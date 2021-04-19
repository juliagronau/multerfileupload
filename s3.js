require("dotenv").config();
const express = require("express");
const app = express();
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const port = process.env.PORT || 3000;

const s3 = new aws.S3({
  accessKeyId: process.env.KEY_ID,
  secretAccessKey: process.env.SECRET,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "multer-practice",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
    acl: "public-read",
  }),
});

app.post("/upload-profile-pic", upload.single("profile_pic"), (req, res) => {
  res.redirect(req.file.location);
});

app.post("/upload-cat-pics", upload.array("cat_pics", 2), (req, res) => {
  const { files } = req;
  console.log(files);
  res.send(
    `<div>You have uploaded these images: <br/> ${files.map(
      file => `<img src="${file.location}" width="300" />`
    )}</div>`
  );
});

app.use(express.static("public"));

app.listen(port, () => console.log(`server is running on port ${port}`));
