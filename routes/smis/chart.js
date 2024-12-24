const express = require('express')
const session = require('express-session')
const router = express.Router()
const mysql2 = require('mysql2')
const { Url } = require('url')
const dbConn = require('../../controls/dbconn')



router.use(express.urlencoded({extended:false}))
router.use(express.json())


router.get('/',(req,res)=>{
    // const urlQuery = Url.parse(req.url,true).query   
    // const processedId = urlQuery.processedId
    // const state = urlQuery.state
    // const month = urlQuery.month

       
    const processedId = `1090630`
    const state = `3`
    const month = `8`
    
    const conn = mysql2.createConnection(dbConn.getDbInfo)    
    
    let b_query = `SELECT b_requestCompany, COUNT(*) as b_count FROM smis
                   WHERE b_processId=${processedId} 
                   AND b_state=${state} 
                   AND MONTH(b_processedDate) = ${month} 
                   group by b_requestCompany                    
                   ORDER BY b_requestCompany ASC`
    
   
    
    const resData = {}
    const b_query1 = conn.query(b_query,(err,rows,fields)=>{

        if(err) throw err

        resData.isAssigned = false
        resData.requestCompany = []
        resData.totalCount = []     
        
        if(rows[0]) {
            resData.isAssigned = true
            rows.forEach((el,index)=>{
                resData.requestCompany.push(el.b_requestCompany)
                resData.totalCount.push(el.b_count)
            })    
        }     
        //return res.json(resData)        
        //res.send(`<script>bind_chart(${resData.requestCompany},${resData.totalCount},'bar')</script>`)
    })

    res.render('smis/chart')
   
})





router.post('/bindChart',(req,res)=>{
    const processedId = req.body.processedId
    const state = req.body.state
    const month = req.body.month
    
    const conn = mysql2.createConnection(dbConn.getDbInfo)    
    
    let b_query = `SELECT b_requestCompany, COUNT(*) as b_count FROM smis
                   WHERE b_processId=${processedId} 
                   AND b_state=${state} 
                   AND MONTH(b_processedDate) = ${month} 
                   group by b_requestCompany                    
                   ORDER BY b_requestCompany ASC`
    
    // let b_query = `SELECT b_requestCompany, COUNT(*) as b_count FROM smis
    //                WHERE b_processId='1090667' 
    //                AND DATE_FORMAT(b_processedDate, '%Y-%m-%d') > '2024-05-01' 
    //                group by b_requestCompany 
    //                ORDER BY b_requestCompany ASC`
    
    // let b_query = `SELECT b_requestCompany, COUNT(*) as b_count FROM smis
    //                WHERE b_processId=${processedId} 
    //                AND MONTH(date_sub(b_processedDate, INTERVAL 1 MONTH)) < MONTH(now()) 
    //                group by b_requestCompany 
    //                WHERE b_state=${state}
    //                ORDER BY b_requestCompany ASC`

   
   
    
    const resData = {}
    const b_query1 = conn.query(b_query,(err,rows,fields)=>{

        if(err) throw err

        resData.isAssigned = false
        resData.requestCompany = []
        resData.totalCount = []     
        
        if(rows[0]) {
            resData.isAssigned = true
            rows.forEach((el,index)=>{
                resData.requestCompany.push(el.b_requestCompany)
                resData.totalCount.push(el.b_count)
            })    
        } 
        //console.log(resData)     
        //console.log(b_query1.sql)
        return res.json(resData)
        
    })

})




module.exports = router


















// router.get('/chart_ejs',(req,res)=>{
//     const conn = mysql2.createConnection(require('../config/appConfig').getDbInfo)
    
//     let b_query = `SELECT b_requestCompany, COUNT(*) as b_count FROM smis WHERE b_processId='1090667' group by b_requestCompany`
//     //let b_params = req.session.userInfo.b_id
   
    
//     const resData = {}
//     const b_query1 = conn.query(b_query,(err,result,fields)=>{
//         resData.b_requestCompany = []
//         resData.b_count = []     
        
//         result.forEach((el,index)=>{
//             resData.b_requestCompany.push(el.b_requestCompany)
//             resData.b_count.push(el.b_count)
//         })

//         console.log(resData)     
//         //return res.json(resData)
//         res.render('chart',{resData:resData})
//     }) 
// })
