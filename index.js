const express = require("express");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 3000;

// handle storage of uploaded file (from multer docu)
const storage = multer.diskStorage({
  // tell it where to store the file
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  // extract the extension of the file (multer does not append it automatically to the filename)
  // tell it how to name the file
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${extension[1]}`);
  },
});

const fileFilter = function (req, file, next) {
  if (!file) {
    next(null, false);
  }
  const extension = file.mimetype.split("/");
  if (
    extension[1] == "jpg" ||
    extension[1] == "jpeg" ||
    extension[1] == "png"
  ) {
    next(null, true);
  } else {
    next(
      new Error("Unsupported Filetype. Accepted types are .png, .jpg, .jpeg")
    );
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// To serve static files such as images, use the express.static built-in middleware function in Express.
app.use(express.static("public"));

app.post(
  "/upload-profile-pic",
  upload.single("profile_pic"),
  (req, res, next) => {
    res.sendFile(`${__dirname}/public/${req.file.filename}`);
  }
);

app.post("/upload-cat-pics", upload.array("cat_pics", 2), (req, res, next) => {
  req.files.map(file => {
    // use html template instead!
    res.sendFile(`${__dirname}/public/${req.files.filename}`);
  });
});

app.listen(port, () => console.log(`Server running in port: ${port}`));
