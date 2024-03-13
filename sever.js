const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUri =
  "mongodb+srv://sahilDb:sahil123@registrationdb.wsycujp.mongodb.net/?retryWrites=true&w=majority&appName=registrationDb";
const path = require("path");
const User = require("./models/user");
const port = 3001;

//database connection
mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb Connected!");
  })
  .catch((err) => {
    console.log("err db connection");
  });

//middlewares
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


//routes

app.get("/", (req, res) => {
  res.send("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
  });

//post routes

app.post('/register', async (req, res)=>{
    const {username, email, password} = req.body;

    user = new User({
        username: username,
        email: email,
        password: password,
      });
  
      await user.save();
      res.send('User Registered Successfully!')
})

app.post('/login', async (req, res)=>{
    const {email, password} = req.body;

    let user = await User.findOne({ email });

  if (!user) {
    return res.redirect("/login");
  }

  const userCorrect = user.password === password;
  if(!userCorrect){
    return res.send("incorrect password");
  }

  res.send('Logged in!')
})

//server starting

app.listen(port, () => {
  console.log("server running on port: ", port);
});
