

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: "true"}));
app.use(express.static("public"));

const uri = "mongodb://localhost:27017/wikiDB";
mongoose.connect(uri);

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);


/*** Targetting all articles ***/
app.route("/articles")
    .get(function(req, res) {
        Article.find()
            .then(foundArticles => {
                res.send(foundArticles);
            })
            .catch(err => {
                res.send(err);
            });
    })
    .post(function(req, res) {
    
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save()
            .then(() => {
                res.send("Article has been successfully saved");
            })
            .catch( err => {
                res.send(err);
            })
    
    })
    .delete(function(req, res) {

        Article.deleteMany()
            .then(() => {
                res.send("All articles have been successfully deleted.");
            })
            .catch(err => {
                res.send(err);
            })
    });

/*** Targetting specific article ***/
app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle})
            .then(foundArticle => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("Sorry, no article was found.");
                }
            })
            .catch(err => {
                res.send(err);
            });
    })
    .put(function(req,res) {
        Article.updateOne(
            {title: req.params.articleTitle},
            {
                title: req.body.title,
                content: req.body.content
            }
        )
        .then(() => {
            res.send("Article successfully updated.");
        })
        .catch( err => {
            res.send(err);
        });
    })
    .patch(function(req,res) {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body}
        )
        .then(() => {
            res.send("Article successfully updated.");
        })
        .catch( err => {
            res.send(err);
        });
    })
    .delete(function(req, res) {
        Article.deleteOne({title: req.params.articleTitle})
        .then(() => {
            res.send("Article successfully deleted.");
        })
        .catch( err => {
            res.send(err);
        });
    });


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running");
});