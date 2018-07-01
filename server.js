'use strict'
var express=require('express');
var bodyParser=require('body-parser');
var request=require('request');
var app=express();

app.set('port',(process.env.PORT || 5000));

//to process the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){

  res.send('Hi Im a Facebook Chatbot');
})

//For Facebook

app.get('/webhook/',function(req,res){
  if(req.query['hub.verify_token']==="Craftorm"){
    res.send(req.query['hub.challenge']);
  }
  res.send("Wrong Token");
})


app.listen(app.get('port'),function(){
  console.log('listenning port');
})
