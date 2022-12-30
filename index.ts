import * as sharp from 'sharp';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Create an Express app
const app = express();
// Set the port
const port = 4000;

// Set up a route to handle image resizing
app.get('/resize', (req, res) => {
  // Get the width and height from the query string
  const width = req.query.width ? parseInt(req.query.width) : null;
  const height = req.query.height ? parseInt(req.query.height) : null;

  // Set the input file
  const inputFile = 'input.jpg';

  // Construct the output file name based on the dimensions
  const outputFile = `resized/output-${width}x${height}.jpg`;

  // Check if the output file already exists
  if (fs.existsSync(outputFile)) {
    // If the file exists, serve it without performing the resize operation
    console.log(`Serving previously resized image: ${outputFile}`);
    res.sendFile(outputFile);
  } else {
    // If the file does not exist, resize the image and save it to the output file
    console.log(`Resizing image and saving to ${outputFile}`);
    sharp(inputFile)
      .resize({ width: width, height: height, fit: 'inside' })
      .toFile(outputFile)
      .then(() => {
        // Set the content type and send the resized image as a response
        res.contentType('image/jpeg');
        res.sendFile(outputFile);
      })
      .catch(err => {
        console.error('Error occurred:', err);
        res.sendStatus(500);
      });
  }
});

// Start the server on port 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
