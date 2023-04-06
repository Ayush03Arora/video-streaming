const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//  multer middleware initialization
const upload = multer({ storage });

//  POST request route for uploading videos
app.post('/videos', upload.single('video'), (req, res) => {
  // Retrieving  file object from the request
  const file = req.file;

  res.status(201).json({
    message: 'Video uploaded successfully',
    file: file,
  });
});

//  GET request for streaming videos
app.get('/videos/:filename', (req, res) => {

  // Retrieving filename parameter from the request
  const filename = req.params.filename;

  // path construction to the video file
  const filePath = `./uploads/${filename}`;

  // Check if the file exists
  if (fs.existsSync(filePath)) {

    // Creating read stream for the video file
    const stream = fs.createReadStream(filePath);

    // Setting content type header to "video/mp4"
    res.setHeader('Content-Type', 'video/mp4');

    
    stream.pipe(res);
  } else {
    // Send a 404 error response if the file does not exist
    res.status(404).json({
      message: 'File not found',
    });
  }
});

//  GET request for downloading videos
app.get('/download/:filename', (req, res) => {

  // Retrieving the filename parameter from the request
  const filename = req.params.filename;

  // Constructing the path to the video file
  const filePath = `./uploads/${filename}`;

  // Checking if the file exists
  if (fs.existsSync(filePath)) {

    // Setting the content disposition header to "attachment" to force download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Create a read stream for the video file
    const stream = fs.createReadStream(filePath);

    
    stream.pipe(res);
  } else {
    // Send a 404 error response if the file does not exist
    res.status(404).json({
      message: 'File not found',
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
