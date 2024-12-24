const express = require('express')
const router = express.Router()


router.get('/',(req,res)=>{
    // if(!req.session.userInfo){
    //     res.redirect('/login')
    // } else {
    //     res.render('index')
    // }
    res.render('index')
})

module.exports = router