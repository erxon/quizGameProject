const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");
const app = express();
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//connect to our database
mongoose.connect("mongodb://localhost:27017/quizGameDB");

const playerSchema = new mongoose.Schema({
  name: String,
  score: Number,
  category: String
});
const Player = mongoose.model("Player", playerSchema);

const samplePlayer = new Player({
  name: "Rick",
  score: 3,
  category: "animals"
});

// samplePlayer.save();

let category = "";
let choices = [];
let score = 0;
let questionIndex = 0;
let correctAnswer = "";
let item = {};
let listOfCorrectAnswers = [];
let playerName = "";

app.get("/", function(req, res){
  category = "";
  choices = [];
  score = 0;
  questionIndex = 0;
  correctAnswer = "";
  item = {};
  listOfCorrectAnswers = [];

  res.render("index");
});

app.get("/question/:category", function(req, res){
  //questions: https://wehavekids.com/education/Multiple-Choice-Quiz-How-well-do-you-know-animals-suitable-for-kids
  category = req.params.category;
  if(_.isEmpty(item)){
    fs.readFile(category+".txt", function(err, data){
      item = JSON.parse(data);
      res.redirect("/question/"+category);
    });
  } else {
    if(questionIndex < item.results.length){
      let questionNumber = item.results[questionIndex].questionNumber;
      let question = item.results[questionIndex].question;

      choices = item.results[questionIndex].choices;
      correctAnswer = choices[item.results[questionIndex].correctAnswer];
      listOfCorrectAnswers.push(correctAnswer);

      res.render("mainGame", {questionNumber: questionNumber, question: question, choices: choices});
    } else{

      const player = new Player({
        name: playerName,
        score: score,
        category: category
      });
      player.save();
      res.render("result", {score: score, answers: listOfCorrectAnswers});
    }
  }
});
app.get("/leaderboardCategory", function(req, res){
  res.render("leaderboardCategory");
});
app.get("/leaderboard/:category", function(req, res){
  Player.find({category: req.params.category}, null, {sort: {score: -1}}, function(err, players){
    res.render("mainLeaderboard", {players: players});
  });
});
app.post("/", function(req, res){
  playerName = req.body.playerName;
  res.render("categories");
});
app.post("/answer", function(req, res){
  const answer = req.body.checkbox;

  if(answer === correctAnswer){
    score+=1;
  }
  questionIndex+=1;
  res.redirect("/question/" + category);
});

app.listen(3000, function(){
  console.log("Server in running on port 3000");
});
