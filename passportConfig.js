import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "./../models/User.js";

export default function (passport){
    passport.use(
        new LocalStrategy({ usernameField: "emailInput" }, function (
            emailInput,
            passwordInput,
            done
        ){
            console.log(`Inside config : ${0}, ${1}`, emailInput,
            passwordInput);
            User.findOne({ email: emailInput }).then((user) => {
                if (!user) {
                    return done(null, false, {
                        type: "fail_passport",
                        message: "No User Found",
                    });
                }
                bcrypt.compare(passwordInput, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            type: "fail_passport",
                            message: "Password Incorrect",
                        });
                    }
                });
            });
        })
    );
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}