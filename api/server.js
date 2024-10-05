const path = require('path');
const fs = require('fs');

// Define the serverless function handler
module.exports = function handler(req, res) {
  const publicDir = path.join(__dirname, '../public'); // Adjust the path

  // Serve static files
  if (req.url === '/') {
    const filePath = path.join(publicDir, 'home.html');

    // Read and serve the home.html file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error loading the home page');
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
      }
    });
  } else {
    // Handle other routes or static file requests
    const staticFilePath = path.join(publicDir, req.url);
    
    fs.readFile(staticFilePath, (err, data) => {
      if (err) {
        res.status(404).send('File not found');
      } else {
        const ext = path.extname(req.url).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.mp4': 'video/mp4'
        };

        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        res.send(data);
      }
    });
  }
};

// Add this to start a server
const express = require('express');
const app = express();

const PORT = 3000;

app.use('/', module.exports);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
