import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles,checkUrl} from './util/util';
// "build": "npm run clean && tsc && cp package.json www/package.json && mkdir www/tmp/ && cd www && zip -r Archive.zip . && cd ..",
import { Router, Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */


  app.get( "/filteredimage", async ( req: Request, res: Response ) => 
  {
      let {image_url}= req.query;
      // console.log(image_url);
      const valid: boolean=await checkUrl(image_url);
      if(!valid)
      {
        return res.status(422).send("Unprocessable entity");
      }
      const filteredImage:string=await filterImageFromURL(image_url);

      res.status(200).sendFile(filteredImage,function (err)
      {
        if(err)
        {
          res.status(400).send('Cant access image');
        }
        else
        {
          deleteLocalFiles([filteredImage]);
        }
      })
      
  } );
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();


// {
//   "name": "udacity-c2-image-filter",
//   "version": "1.0.0",
//   "description": "",
//   "main": "index.js",
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "clean": "rm -rf www/ || true",
//     "build": "npm run clean && tsc && cp package.json www/package.json && mkdir www\\tmp && cd www && zip -r Archive.zip . && cd ..",
//     "dev": "ts-node-dev --respawn --transpileOnly ./src/server.ts",
//     "start":"node server.js"
//   },