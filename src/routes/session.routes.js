const {Router} = require('express');
const passport = require('passport');
const sessionController = require('../controller/session.Controller');

const router = Router();

router.post('/login' , sessionController.sessionLogin);
router.post('/register', sessionController.register);
router.get("/logout", sessionController.logout)
router.get('/github', passport.authenticate("github" , {scope: ["user:email"]}), async (req , res ) => {});
router.get('/github/callback' , passport.authenticate("github" , {failureRedirect: "/login"}), sessionController.github);

module.exports = router;