const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const app = require('express')();
const cors = require('cors')({origin: true});

app.use(cors);

admin.initializeApp();

app.get('/kfc/:chicken_amount/:side_amount/:drink_amount/:popcorn_amount/:sandwich_amount',  (req, res) => {
  
  let ref = "/cache/kfc";
  let options = "";
  
  for(let key in req.params){
    options+= "/"+req.params[key];
    req.params[key] = parseInt(req.params[key]);
  }
  
  ref+=options;
 
  let dbref = admin.database().ref();
  
  dbref.child(ref).once("value").then(snapshot=>{
    if(snapshot.exists()){
      res.send(JSON.stringify(snapshot.val()));
    }else{
      let url = "https://api.menumizer.com/tt/kfc";
      fetch(url, {
        method: 'POST',
        body:    JSON.stringify(req.params),
        headers: { 'Content-Type': 'application/json' },
      }).then(result=>{
        result.json().then(json=>{
          dbref.child(ref).set(json);
          res.send(JSON.stringify(json));
        });
        
      });
      
    }
  });
  
  dbref.child("/count"+options).transaction(val=>{
    return (val || 0) + 1
  });
  
  dbref.child("/totalMizers").transaction(val=>{
    return (val || 0) + 1
  });

  
});

// We name this function "route", which you can see is
// still surfaced in the HTTP URLs below.
exports.menumize = functions.https.onRequest(app);
