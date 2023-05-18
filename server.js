const { exec } = require('child_process');
const express = require('express');
const request = require('request');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
  // Extract arguments from query string
  const args = [
    req.query.args1,
    req.query.args2,
    req.query.args3,
    req.query.args4,
  ];

  // Array of websites to scan
  const websites = [
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/proxy.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt'
    // Add more websites here
  ];

  // Create content.txt file if it doesn't exist
  fs.writeFile('proxy.txt', '', (error) => {
    if (error) {
      res.status(500).send(`Error creating file: ${error.message}`);
      return;
    }

    // Loop through each website and append its content to the file
    websites.forEach((website, index) => {
      request(website, (error, response, body) => {
        if (error) {
          res.status(500).send(`Error getting website content: ${error.message}`);
          return;
        }

        fs.appendFile('proxy.txt', body, (error) => {
          if (error) {
            res.status(500).send(`Error appending content to file: ${error.message}`);
            return;
          }

          // If this is the last website in the array, execute null.js
          if (index === websites.length - 1) {
            // Run null.js with extracted arguments
            const command = `node null.js ${args.join(' ')}`;
            exec(command, (error, stdout, stderr) => {
              if (error) {
                res.status(500).send(`Error running null.js: ${error.message}`);
                return;
              }

              if (stderr) {
                res.status(500).send(`Error running null.js: ${stderr}`);
                return;
              }

              // Send output from null.js to response
              res.send(stdout);
            });
          }
        });
      });
    });
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
