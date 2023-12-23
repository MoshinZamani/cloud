const connectToDB = require("./tools/connect");
const express = require("express");
const bodyParser = require("body-parser");
const routeUsers = require("./routes/user");
const routePosts = require("./routes/post");
const verifyToken = require("./verifyToken");

const app = express();
app.use(bodyParser.json());

app.use("/users", routeUsers);
app.use("/posts", routePosts);

app.get("/token", verifyToken, (req, res) => {
  res.send("token verified");
});

connectToDB();

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
