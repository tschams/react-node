import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
// Local
import { USER_JWT_SECRET } from "../config";
import { VendorUser as UserModel } from "../db";
import { PasswordUtils } from "../lib/security/passwords";

//Create a passport middleware to handle user registration?? Not sure...
// passport.use(
//   "signup",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         //Save the information provided by the user to the the database
//         const user = await UserModel.create({ email, password });
//         //Send the user information to the next middleware
//         return done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     },
//   ),
// );

//Create a passport middleware to handle User login
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        //Find the user associated with the email provided by the user
        const user = await UserModel.findForLogin(email);
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const valid = await PasswordUtils.compare(user.passwordHash, password);
        if (!valid) {
          return done(null, false, { message: "Invalid Password" });
        }
        //Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

//This verifies that the token sent by the user is valid
passport.use(
  "jwt",
  new JWTStrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: USER_JWT_SECRET,
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        //Pass the user details to the next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
