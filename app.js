const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

let chosenCategory = "";
let choices = [];
let score = 0;
let questionIndex = 0;

let correctAnswer = "";

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/question/:category", function(req, res){
  //questions: https://wehavekids.com/education/Multiple-Choice-Quiz-How-well-do-you-know-animals-suitable-for-kids

  chosenCategory = req.params.category;
  fs.readFile(chosenCategory+".txt", function(err, data){
    let item = JSON.parse(data);
    const listOfCorrectAnswers = [];
    if(questionIndex < item.results.length){
      let questionNumber = item.results[questionIndex].questionNumber;
      let question = item.results[questionIndex].question;

      choices = item.results[questionIndex].choices;
      correctAnswer = choices[item.results[questionIndex].correctAnswer];
      listOfCorrectAnswers.push(correctAnswer);

      res.render("mainGame", {questionNumber: questionNumber, question: question, choices: choices});
    } else{
      console.log(score);
      console.log(listOfCorrectAnswers);
    }
  });
});
app.post("/answer", function(req, res){
  const answer = req.body.checkbox;

  if(answer === correctAnswer){
    score+=1;
  }
  questionIndex+=1;
  res.redirect("/question/"+chosenCategory);
});

app.listen(3000, function(){
  console.log("Server in running on port 3000");
});
