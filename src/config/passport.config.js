const passport = require('passport');
const GithubStrategy = require('passport-github2');
const userModelGithub = require('../dao/models/user.modelGithub');
const local = require('passport-local');
const { createHashValue, isValidPassword } = require('../utils/encrypt');
const userModel = require('../dao/models/user.model');


const GITHUB_CLIENT_ID = "290c52ff9d584eb6d62a";
const GITHUB_CLIENT_SECRET = "93c4872e5fe4f1ccc3aa917dc2974100605853a6";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register' , new LocalStrategy({passReqToCallback:true, usernameField:'email'} , async (req ,username ,password , done) => {
        const { firstName , lastName , email } = req.body
        try {
            let user = await userModel.findOne({email: username});
            if (user){
                return done (null , false);
            } else { 
            if (email === 'adminCoder@coder.com') {
            const user = {
                firstName,
                lastName,
                email,
                password: await createHashValue(password),
                rol: 'Administrador'
            } 
            let result = await userModel.create(user)
                done(null ,result)
                } else {
                const user = {
                    firstName,
                    lastName,
                    email,
                    password:await createHashValue(password),
                    rol: 'Usuario'
            } 
            let result = await userModel.create(user)
                done(null , result);
        }}
        } catch (error) {
            return done('Error al obtener usuario: ' + error)
        }
    }))


    passport.use('login' , new LocalStrategy({usernameField: 'email'} , async( username ,password,done)=>{
        try {
            const user = await userModel.findOne({email: username});
            if (!user) {
                return done( null, false)
            }
            if(isValidPassword(user ,password)) return done(null , false);
            return done (null , user);
        } catch (error) {
            return done (error)
        }
    }))

    passport.use(
        "github",
        new GithubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackUrl: "http://localhost:8080/api/session/github/callback",
        },
        async (accessToken , refreshToken , profile , done) => {
            try {
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
