var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// These will be used in our scraping
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

// Initialize express, which is used for our routing
var app = express();

// Using morgan for logging requests
app.use(logger("dev"));
// For parsing request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 'public' needs to be a static folder
app.use(express.static("public"));

// Mongo DB connection
mongoose.connect("mongodb://localhost/unit18Populater", {
  useNewUrlParser: true
});

// Routes =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// This route is for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // ..grab body of html with axios
  axios.get("http://www.echojs.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("article h2").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // This creates the new Article using the 'result' object being built in the scrape
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    //  Once complete, confirmation is sent to DOM
    res.send("Scrape Complete");
  });
});

// Route for retrieving all articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting a certain article by its id, and populating it with its note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
