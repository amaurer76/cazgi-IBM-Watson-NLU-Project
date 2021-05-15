const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

const analyzeParams = function(){ return {
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  }
}
};

function getNLUInstance() {
    const api_key = process.env.API_KEY;
    const api_url = process.env.API_URL;
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
    var analyzeParms = analyzeParams();
    analyzeParms.url = req.query.url;
    getNLUInstance().analyze(analyzeParms)
  .then(analysisResults => {
    var result = {};
    result.emotions = analysisResults.result.entities[0].emotion;
    result.confidence = analysisResults.result.entities[0].confidence;
    console.log(JSON.stringify(result, null, 2));
        res.end(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });
});

app.get("/url/sentiment", (req,res) => {
  var analyzeParms = analyzeParams();
  analyzeParms.url = req.query.url;
getNLUInstance().analyze(analyzeParms)
  .then(analysisResults => {
    var result = {};
    if(analysisResults.result.keywords 
        && analysisResults.result.keywords[0] 
        && analysisResults.result.keywords[0].sentiment) {
            result.sentiment = analysisResults.result.keywords[0].sentiment.label;
            result.confidence = -1;
        }
    else {
        result.sentiment = "neutral";
        result.confidence = -1;
    }
    console.log(JSON.stringify(result, null, 2));
        res.end(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });
});

app.get("/text/emotion", (req,res) => {
  var analyzeParms = analyzeParams();
  analyzeParms.text = req.query.text;
getNLUInstance().analyze(analyzeParms)
.then(analysisResults => {
  var result = {};
  result.emotions = analysisResults.result.entities[0].emotion;
  result.confidence = analysisResults.result.entities[0].confidence;
  console.log(JSON.stringify(result, null, 2));
      res.end(JSON.stringify(result, null, 2));
})
  .catch(err => {
    console.log('error:', err);
  });
});

app.get("/text/sentiment", (req,res) => {
    var analyzeParms = analyzeParams();
    analyzeParms.text = req.query.text;
    getNLUInstance().analyze(analyzeParms)
    .then(analysisResults => {
      var result = {};
      if(analysisResults.result.keywords 
          && analysisResults.result.keywords[0] 
          && analysisResults.result.keywords[0].sentiment) {
              result.sentiment = analysisResults.result.keywords[0].sentiment.label;
              result.confidence = -1;
          }
      else {
          result.sentiment = "neutral";
          result.confidence = -1;
      }
      console.log(JSON.stringify(result, null, 2));
          res.end(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.log('error:', err);
    });
});


let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

