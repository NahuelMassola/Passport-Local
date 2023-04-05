const BdProductManager = require('../dao/mongoManager/BdProductManager')
const BdSessionManager = require('../dao/mongoManager/BdSessionManager')
const { isValidPassword, createHashValue } = require('../utils/encrypt')


const sessionLogin = async (req, res) => {
        
    try {
        const { email , password} = req.body
        const user = await BdSessionManager.getsession(email)
        if (!user){
            return res.status(401).json({message: "Email o contraseña incorrcto, sino tiene usuario por favor registrese"})
        } 
        const isValidComparePsw = await isValidPassword(password , user.password);
        if(!isValidComparePsw) {
            return res.status(401).json({menssage: "Credenciales incorrectas"})
        }
    
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") { 
            const products = await BdProductManager.getProduct();
                res.render("viewProduct", {
                    products: products,
                    lastName: req.session?.users?.last_name || user.lastName.toUpperCase(),
                    firstName: req.session?.users?.firstName || user.firstName.toUpperCase(),
                    rol: "Administrador"
                })
        } else { const products = await BdProductManager.getProduct();
            res.render("viewProduct", {
                products: products,
                lastName: req.session?.users?.last_name || user.lastName.toUpperCase(),
                firstName: req.session?.users?.firstName || user.firstName.toUpperCase(),
                rol: "Usuario"
            })}
    } catch (error) {
        res.status(500).json({
            message: "Error",
            playload: error.message
        })
    } 
}

const register = async (req, res) =>{
    res.send ({
        statuss: 'Success',
        message:'Usuario Registrado',
    })
}

const failregister = async (req , res) => {
    res.send({
        error:'Failed Register',
    })
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (!err) return res.redirect("/login");
        return res.send({ message: `logout Error`, body: err });
    });
}; 

const github = async(req, res) =>{
    try {
        const products = await BdProductManager.getProduct();
        req.user.rol = "Usuario"
        res.render("viewProduct", {
            products: products,
            firstName: req.user.firstName,
            rol: req.user.rol
            });
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    sessionLogin , 
    register , 
    logout ,
    github , 
    failregister,
}
