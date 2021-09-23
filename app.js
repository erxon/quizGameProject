const express = require("express");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs")

let choices = [];
let score = 0;
let questionIndex = 0;
let correctAnswer = 0;

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/question/:category", function(req, res){
  //questions: https://wehavekids.com/education/Multiple-Choice-Quiz-How-well-do-you-know-animals-suitable-for-kids
  fs.readFile(req.params.category+".txt", function(err, data){
    let item = JSON.parse(data);
    let questionNumber = item.results[0].questionNumber;
    let question = item.results[0].question;
    choices = item.results[0].choices;
    correctAnswer = item.results[0].correctAnswer;
    res.render("mainGame", {questionNumber: questionNumber, question: question, choices: choices});
  });
});

app.listen(3000, function(){
  console.log("Server in running on port 3000");
});
