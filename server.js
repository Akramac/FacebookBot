'use strict'
var express=require('express');
var bodyParser=require('body-parser');
var request=require('request');
var app=express();

var token=process.env.FB_VERIFY_TOKEN;
var access=process.env.FB_ACCESS_TOKEN;

app.set('port',(process.env.PORT || 5000));

//to process the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){

  res.send('Hi Im a Facebook Chatbot');
})

//For Facebook

app.get('/webhook/',function(req,res){
  if(req.query['hub.verify_token']===token){
    res.send(req.query['hub.challenge']);
  }
  res.send("Wrong Token");
})

/*app.post('/webhook/',function(req,res){
  var messaging_events=req.body.entry[0].messaging;
  for (var i=0;i<messaging_events.lenght;i++){
    var event=req.body.entry[0].messaging[i];
  }
})*/


//from Facebook quick start messenger API
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      entry.messaging.forEach(function(event){
        if(event.message){ receivedMessage(event);}
        console.log("Webhook received unknown event :",event);
      })
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

function receivedMessage(event){
  console.log('Message data :',event.message);
}
app.listen(app.get('port'),function(){
  console.log('listenning port');
})
