const passport = require('passport');
const GithubStrategy = require('passport-github2');
const userModelGithub = require('../dao/models/user.modelGithub');

const GITHUB_CLIENT_ID = "290c52ff9d584eb6d62a";
const GITHUB_CLIENT_SECRET = "93c4872e5fe4f1ccc3aa917dc2974100605853a6";


const initializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackUrl: "http://localhost:8080/api/session/github/callback",
        },
        async (accessToken , refreshToken , profile , done) => {
            try {
                console.log(profile);
            let user = await userModelGithub.findOne({ email: profile._json?.email});
            if(!user){
                let addNewUser = {
                    firstName: profile._json.name,
                    email: profile._json?.email,
                    password: ""
                };
                let newUser = await userModelGithub.create(addNewUser);
                
                done(null , newUser);
            } else {
                done(null ,user);
            }
            } catch (error) {
                return done(error);
            }
        } 
        )
    );

    passport.serializeUser((user , done) =>{
        done(null , user._id);
    })

    passport.deserializeUser(async (id , done) => {
        let user = await userModel.findById({_id: id})
        done (null , user)
    });
}


module.exports = initializePassport ;
