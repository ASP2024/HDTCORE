const express = require('express')
const mysql2 = require('mysql2')
const dbconn = require('../../controls/dbconn')
const bcrypt = require('bcrypt')
const router = express.Router()

router.use(express.urlencoded({extended:false}))
router.use(express.json())



router.get('/',(req,res)=>{
    res.render('./account/createMember',{layout:false})
})

// id 중복 검사      isIdExists:true(존재함) / false(존재하지 않음) 
router.post('/isIdExists',(req,res)=>{        
    
     const id = req.body.id     
     const b_query = `SELECT COUNT(*) as countOfId FROM members WHERE b_id = ?`
     const b_params = [id]
     const conn = mysql2.createConnection(dbconn.getDbInfo)
     conn.query(b_query,b_params,(err,rows,fields)=>{   
        
        if(err) throw err  // table이 존재하지 않을 경우
        
        if(rows[0].countOfId > 0) {
            res.json({isIdExists:true,id:id})  // 사용중            
        } else {
            res.json({isIdExists:false,id:id}) // 사용가능           
        }
        
       
     })           
})



router.post('/searchDepartmentCode',(req,res)=>{
    let idDepartmentExists = false
    let departmentCode = []
    let departmentName = []

    const b_query = `SELECT b_departmentCode,b_departmentName FROM departmentInfo WHERE b_departmentCode like '%L%'`
    const b_params = [req.body.departmentCode]
    const conn = mysql2.createConnection(dbconn.getDbInfo)
    const b_result = conn.query(b_query,b_params,(err,rows,fields)=>{
                        if(err) throw err
                        if(rows[0]) {
                            idDepartmentExists = true
                            for(let index=0 ; index < rows.length; index++) {                                 
                                    departmentCode.push(rows[index].b_departmentCode)
                                    departmentName.push(rows[index].b_departmentName)
                            }                           
                            
                            res.json({departmentCode,departmentName})                           
                        }
                        
    })
})



router.post('/createUserUp',(req,res)=>{       
    
    let b_id = req.body.txtId
    let b_password = bcrypt.hashSync(req.body.txtpassword,10)    // 암호화 bcrypt
    let b_userName = req.body.txtuserName
    let b_departmentCode = req.body.txtDepartmentCode
    let b_departmentName = req.body.txtDepartmentName
    let b_hp = req.body.txthp1 + '-' + req.body.txthp2 + '-' + req.body.txthp3
    let b_email = req.body.txtemail
    let b_region = req.body.txtregion
    let b_content = req.body.txtcontent   

    let b_params = [
        b_id,
        b_password,
        b_userName,
        b_departmentCode,
        b_departmentName,
        b_hp,
        b_email,
        b_region,
        b_content
    ]    
    
    const dbconn1 = dbconn.getConnect()
    let b_sql = `INSERT INTO members(
                   b_id,
                   b_password,
                   b_create_time,
                   b_userName,
                   b_departmentCode,
                   b_departmentName,
                   b_hp,
                   b_email,
                   b_region,b_content
                 ) 
                 VALUES(
                   ?,
                   ?,
                   now(),
                   ?,
                   ?,
                   ?,
                   ?,
                   ?,
                   ?,
                   ?
                 )`
    const aa1 = dbconn1.query(b_sql,b_params,(err,result,fields)=>{
          if(!err) {
            res.send(`<script>
                          alert('${b_id}님 회원가입이 완료되었습니다.\\n로그인 페이지로 이동합니다.');
                          location.href = '/';
                   </script>`)
          } else {
                 res.send(err)  
          }
    })
   
})



module.exports = router