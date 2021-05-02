const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

const analyzeParams = {
  'url': 'www.ibm.com',
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    }
}
};

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  serviceUrl: api_url,
});
return naturalLanguageUnderstanding;
}
app.use(express.static('client'));

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    return getNLUInstance().analyze(analyzeParams, req.query.url);
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
console.log(req);
getNLUInstance().analyze(analyzeParams, req.query.text)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
        res.end(JSON.stringify(analysisResults, null, 2));
        return "hey";
  })
  .catch(err => {
    console.log('error:', err);
  });
    return ;
});

app.get("/text/sentiment", (req,res) => {
getNLUInstance().analyze(analyzeParams, req.query.text)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    return analysisResults;
  })
  .catch(err => {
    console.log('error:', err);
  });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

