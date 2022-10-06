import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import ideaRoute from "./routes/ideasRoute.js";
import usersRoute from "./routes/usersRoute.js";
import passport from "passport";
import passportConfig from "./config/passportConfig.js";
passportConfig(passport);
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PORT);
console.log(process.env.mongoURI);

const app = express();
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Mongodb connected..");
  })
  .catch((err) => console.log(err));
import Idea from "./models/Idea.js";

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(morgan("tiny"));
app.use(express.static("views/public"));
// beginning of middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "anything",
    reserve: true,
    saveUninitialized: true,
    cookie: {
      //maxAge: 60 * 1000, // 10 seconds
    }
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.fail_passport = req.flash("fail_passport");
  res.locals.user = req.user || null;
  //add console.log for user status checking
  console.log("======login user======", res.locals.user);
  next();
});
app.get("/", (req, res) => {
    const title = "hello";
    res.render("index", { title: title });
});
import ensureAuthenticated from "./helpers/auth.js";

app.get("/about", (req, res) => {
    res.render("about");
});

app.use("/ideas",ensureAuthenticated, ideaRoute);
app.use("/users", usersRoute);

app.use("*", (req, res) => {
  res.status(404);
  res.render("404");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
