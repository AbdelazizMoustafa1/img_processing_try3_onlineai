import * as request from 'request';
import * as sharp from 'sharp';

describe('Image resizing', () => {
  it('should resize an image to the specified dimensions', async () => {
    // Set the input and output files
    const inputFile: string = 'input.jpg';
    const outputFile: string = 'output.jpg';

    // Set the expected dimensions
    const expectedWidth: number = 500;
    const expectedHeight: number = 400;

    try {
      // Perform the resize operation
      const data: Buffer = await sharp(inputFile)
        .resize({ width: expectedWidth, height: expectedHeight, fit: 'inside' })
        .toBuffer();

      // Read the output image file and check its dimensions
      const metadata: sharp.Metadata = await sharp(data).metadata();
      expect(metadata.width).toEqual(expectedWidth);
      expect(metadata.height).toEqual(expectedHeight);
    } catch (err) {
      console.error('Error occurred:', err);
    }
  });
});

describe('/resize endpoint', () => {
  it('should return a resized image with the specified dimensions', async done => {
    // Set the width and height in the query string
    const width: number = 500;
    const height: number = 400;
    const queryString: string = `?width=${width}&height=${height}`;

    try {
      // Make a request to the /resize endpoint
      const res: request.Response = await request.getAsync(
        `http://localhost:4000/resize${queryString}`
      );

      // Check the response status code
      expect(res.statusCode).toEqual(200);

      // Read the output image and check its dimensions
      const metadata: sharp.Metadata = await sharp(res.body).metadata();
      expect(metadata.width).toEqual(width);
      expect(metadata.height).toEqual(height);

      done();
    } catch (err) {
      console.error('Error occurred:', err);
      done.fail(err);
    }
  });
});
