var express=require('express');
var bodyParser=require('body-parser');
var request=require('request');
var app=express();

const PAGE_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
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
    const VERIFY_TOKEN = token;
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

      /*Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      entry.messaging.forEach(function(event){
        if(event.message){ receivedMessage(event);}
        console.log("Webhook received unknown event :",event);
      })
    });*/


    // Gets the body of the webhook event
     let webhook_event = entry.messaging[0];
     console.log(webhook_event);

     // Get the sender PSID
     let sender_psid = webhook_event.sender.id;
     console.log('Sender PSID: ' + sender_psid);

  // Check if the event is a message or postback and
  // pass the event to the appropriate handler function
  if (webhook_event.message) {
    handleMessage(sender_psid, webhook_event.message);
  } else if (webhook_event.postback) {
    handlePostback(sender_psid, webhook_event.postback);
  }

    // Return a '200 OK' response to all events
  //res.status(200).send('EVENT_RECEIVED');
  res.sendStatus(200);

} /*else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }*/

});

function receivedMessage(event){
  console.log('Message data :',event.message);
}
app.listen(app.get('port'),function(){
  console.log('listenning port');
})
}
// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
   let request_body = {
     "recipient": {
       "id": sender_psid
     },
     "message": response
   }
   // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": token },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}
