const express = require("express"); 
const https = require("https");
const bodyParser = require("body-parser");
const { stringify } = require("querystring");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/", function (req, res) {
  var username = req.body.profile;
  var url = "https://api.github.com/users/";
  // console.log(profileName)
  var options = {
    host: "api.github.com",
    path: "/users/" + username,
    method: "GET",
    headers: { "user-agent": "node.js" },
  };
  var request = https.request(options, function (response) {
    console.log(response.statusCode);
    
    var body = "";
    response.on("data", function (chunk) {
      body += chunk.toString("utf8");
    });

    response.on("end", function () {
      body = JSON.parse(body);
      // console.log(body);
      id = body.login;
      avatar = body.avatar_url;
      proname = body.name;
      names = [];
      var languages = [];
      var reposCreated = [];
      var follow = body.followers
      var createDate = body.created_at
      createDate = createDate.split("T")
      createDate = createDate[0]
      console.log(follow)
      var options = {
        host: "api.github.com",
        path: "/users/" + username + "/repos",
        method: "GET",
        headers: { "user-agent": "node.js" },
      };
      https.get(options, function (response) {
        var info = "";
        response.on("data", function (allInfo) {
          info += allInfo.toString("utf8");
        });
        response.on("end", function () {
          info = JSON.parse(info);
          // info = JSON.parse(info);

          // console.log(info.length)
          // console.log(info[1].name)

          for (var i = 0; i < info.length; i++) {
            var name = info[i].name;
            names.push(name);
            var language = info[i].language;
            languages.push(language);
            var repoCreated = info[i].created_at
             repoCreated = repoCreated.split("T");
             repoCreated = repoCreated[0];
             reposCreated.push(repoCreated);
             
          }

          
            res.render("post", {
              data: id,
              imgurl: avatar,
              subname: " (" + proname + ") ",
              profileurl: body.html_url,
              repos: body.public_repos,
              naam: names,
              created:createDate,
              fol:follow,
              lang: languages,
              repoC:reposCreated

            });
        });
      });
    });
  });


  request.end();

});

app.listen(process.env.PORT || 4000, function (req, res) {
  console.log("server running at port 4000");
});
