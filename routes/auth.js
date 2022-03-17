const router = require("express").Router();
const {check, validationResult} = require("express-validator")
const {users} = require("../db")
const bcrypt  = require("bcrypt")
const JWT = require("jsonwebtoken")

router.post("/signup", [
    check("email", "Please provide a valid email")
        .isEmail(),
    check("password", "Please provide password with at least 6 characters")
        .isLength({
            min:6
        })
], async (req, res)=>{

    const{password, email} = req.body;

    //validated the input
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    //validate if user exists already

    let user = users.find((user)=>{
        return user.email === email
    })

    if(user){
        return res.status(400).json({
                "errors": [
                  {
                    "msg": "This user already exists",
                  }
                ]
            })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //save to database
    users.push({
        email,
        password:hashedPassword
    })


    //create the JWT
    const token = await JWT.sign({
        email
    }, "hh6j754645wsecghvhjkjllfdbfn", {
        expiresIn:3600000
    })

    res.json({
        token
    })

    console.log(hashedPassword)
})

router.get("/all", (req, res)=>{
    res.json({users})
})

// router.post('/login', async(req, res)=>{
//     const {password, email} = req.body;

//     let user = users.find((user) =>{
//         return user.email = email
//     });

//     if(!user){
//         return res.status(400).json({
//                 "errors": [
//                   {
//                     "msg": "Password or Username is incorrect",
//                   }
//                 ]
//             })
//     };


// })

module.exports = router;