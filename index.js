require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let urls =[];

app.post("/api/shorturl" , async(req,res) => {
  let url = req.body.url.replace(/\/*$/, '');
  let validUrl = url.replace(/^https:\/\/(www.)?/, '');
  let hostname = validUrl.replace(/\.com\/.*$|\.org\/.*$/, (match) => {
    if (match.startsWith(".com")) {
        return ".com";
    } else if (match.startsWith(".org")) {
        return ".org";
    }
    return match; // Return the original match if it's not .com or .org
  });  
  dns.lookup(hostname,(err) => {
    if(err){
      return res.json({
        error:"invalid url"
      })
    }else{
      if(!urls.includes(url)){
        urls.push(url);
      }
      return res.json({
        original_url:url,
        short_url:urls.indexOf(url) +1,
      })
    }
  });
})

app.get("/api/shorturl/:id", (req,res) => {
  const id = req.params.id;
  
  const externalURL = urls[id-1];
  
  res.redirect(externalURL);
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
