const express = require('express')
const mysql2 = require('mysql2')
const dbconn = require('../../controls/dbconn')
const router = express.Router()

router.use(express.urlencoded({extended:false}))
router.use(express.json())


router.get('/',(req,res)=>{         
   
    // if(!req.session.userInfo) {             
    //     return res.redirect('/login/login')
    // }

    // b_idx,b_state 값이 있으면 데이타 출력
    if(req.query.idx) {
          
            let b_query = `SELECT *,trim(b_receiptContent) as tr FROM SMIS WHERE b_idx=?`
            let b_params = [req.query.idx]        
    
            const conn = mysql2.createConnection(dbconn.getDbInfo)
            conn.query(b_query,b_params,(err,result,fields)=>{                                                   
                   res.render('smis/content.ejs',{result:result})
            })          
                              
    } else{  // b_idx,b_state 값이 없으면 빈페이지 출력
        let result = [{}]
        res.render('smis/content.ejs',{result:result})
    }
    
   
    // 출력 테스트
    // resultReceiptProcess = {
    //         b_receiptName : '접수자 이름',
    //         b_receiptContent : '접수 내용',
    //         b_processName : '처리자 이름',
    //         b_processedContent : '처리 내용'
    // }
})



router.post('/searchRequestCompanyInfo',(req,res)=>{
    let b_result = {}    
    
    const b_requesterTel = req.body.tel
    const conn = mysql2.createConnection(dbconn.getDbInfo)
    const b_query = `SELECT * FROM smis WHERE b_requesterTel =? ORDER BY b_receptionDate DESC limit 1`
    const b_sql = conn.query(b_query,[b_requesterTel],(err,rows,fields)=>{
        b_result.isExists = 'false'
        if(!err){
            if(rows.length>0){
                b_result.isExists = 'true'
                b_result.RequestCompany = rows[0].b_requestCompany
                b_result.RequestDepartment = rows[0].b_requestDepartment            
                b_result.RequesterName = rows[0].b_requesterName           
            }                     
        }
        res.json(b_result)              
    })

    //console.log(b_sql)
    

    

})




router.post('/Autocomplete_modelCode',(req,res)=>{
    b_result = {}
    b_result.isExists = 'false'
    b_result.modelCode = []
    b_result.memberList = []        
    const conn = mysql2.createConnection(require('../../controls/dbconn').getDbInfo)

    const b_query = `SELECT * FROM modelcode`
    const b_sql = conn.query(b_query,(err,rows,fields)=>{
        
        if(!err){
            if(rows.length>0){
                b_result.isExists = 'true'
                for(let index=0 ; index<rows.length ; index++) {
                    b_result.modelCode.push(rows[index].b_code + " " + rows[index].b_name) 
                }                                
            }                     
        }           
        res.json(b_result)  
    })   
})




router.post('/Autocomplete_processId',(req,res)=>{
    b_result = {}
    b_result.isExists = 'false'   
    b_result.memberList = []        
    const conn = mysql2.createConnection(dbconn.getDbInfo)
    
    const b_query2 = `SELECT * FROM members`
    const b_sql2 = conn.query(b_query2,(err,rows,fields)=>{
 
        if(!err){
            if(rows.length>0){
                b_result.isExists = 'true'
                for(let index=0 ; index<rows.length ; index++) {
                    b_result.memberList.push(rows[index].b_userName + " " + rows[index].b_id + " " + rows[index].b_departmentCode + " " + rows[index].b_departmentName ) 
                }                                
            }                     
        }
        res.json(b_result)  
    })  
})
    





function saveReceipt() {
     
}

router.post('/saveReceipt',(req,res)=>{
   
     const b_idx = 1
     const b_query = `
                     INSERT INTO smis 
                     SET
                        
                        b_insertedDate = now(),
                        
                        b_csrNo1 = '${req.body.txtReceptionDepartmentCode}',  
                        b_csrNo2 = (SELECT date_format(now(),'%y%m')),                  
                        b_csrNo3 = (SELECT ifnull(MAX(s.b_csrNo3),0) + 1 FROM smis AS s ),

                        b_state = '${b_idx}',                       
                        b_receptionistName = '${req.body.txtRceptionistName}',
                        b_receptionistId = '${req.body.txtRceptionistId}',
                        b_receptionDepartmentName = '${req.body.txtReceptionDepartmentCode}',
                        b_receptionDepartmentCode = '${req.body.txtReceptionDepartmentName}',                        

                        b_receptionDate = '${req.body.txtReceiptDate}',
                        b_receptionTime = '${req.body.txtReceiptHour}:${req.body.txtReceiptMin}',
                        b_requestCompany = '${req.body.txtRequestCompany}',
                        b_requestDepartment = '${req.body.txtRequestDepartment}',
                        b_requesterName = '${req.body.txtRequesterName}',
                        b_requesterTel = '${req.body.txtRequesterTel1}-${req.body.txtRequesterTel2}-${req.body.txtRequesterTel3}',
                        b_modelCode = '${req.body.txtModelCode}',
                        b_modelName = '${req.body.txtModelName}',
                        b_receiptContent = '${req.body.txtReceiptContent}',

                        b_processName= '${req.body.txtProcessName}',
                        b_processId= '${req.body.txtProcessId}',
                        b_processDepartmentName = '${req.body.txtPorcessDepartmentName}',
                        b_processDepartmentCode = '${req.body.txtPorcessDepartmentCode}'
                        `                    
                     
    //console.log(b_query)
    
    let insertId 
    const conn = mysql2.createConnection(dbconn.getDbInfo)
    const queryReceipt = conn.query(b_query,(err,result,fields)=>{
        if(!err) {            
            insertId = result.insertId       
            res.send(`<script>
                            alert('접수완료');
                            location.href='/smis/content?idx=${insertId}&state=1';
                    </script>
                    `)        
        }
        else {
              console.log(err)
        }        //console.log(queryReceipt.sql)

    })   

})




router.post('/saveProcess',(req,res)=>{    
   

    let b_state = req.body.txtState   
    if(b_state == 1) {  // b_state값이 존재하면(접수됨) 업데이트 실행(처리)
            
            let b_idx = req.body.txtIdx
            let b_query = `UPDATE SMIS SET 
                           b_state=3,                          
                           b_updatedDate= 'now()',                           
                           b_ProcessedDate = '${req.body.txtProcessedDate}',
                           b_ProcessedTime = '${req.body.txtProcessedHour}:${req.body.txtProcessedMin}',                        
                           b_category= '${req.body.sltCategory1 + '-' + req.body.sltCategory2 + '-' + req.body.sltCategory3}',
                           b_processedContent= '${req.body.txtProcessedContent}' 
                           WHERE b_idx= '${b_idx}' `           
        
            const conn = mysql2.createConnection(dbconn.getDbInfo)
            const queryProcess = conn.query(b_query,(err,result,fields)=>{            
                if(!err) {
                    res.send(`<script>
                            alert('처리완료');
                            location.href='/smis/content?idx=${b_idx}&state=${b_state}';
                        </script>
                    `)
                } else {
                    throw err
                }
                
               
            })    

           //console.log('완료')
            


    } else  {   // b_state값이 1이 아니면 처음 접속된 페이지 이므로 (접수 및 처리 모두 저장)
           
            
            
            const b_query = `
                            INSERT INTO smis 
                            SET
                               
                               b_insertedDate = now(),
                               
                               b_csrNo1 = '${req.body.txtReceptionDepartmentCode}',  
                               b_csrNo2 = (SELECT date_format(now(),'%y%m')),                  
                               b_csrNo3 = (SELECT ifnull(MAX(s.b_csrNo3),0) + 1 FROM smis AS s ),
       
                               b_state = '3',                       
                               b_receptionistName = '${req.body.txtRceptionistName}',
                               b_receptionistId = '${req.body.txtRceptionistId}',
                               b_receptionDepartmentName = '${req.body.txtReceptionDepartmentCode}',
                               b_receptionDepartmentCode = '${req.body.txtReceptionDepartmentName}',                        
       
                               b_receptionDate = '${req.body.txtReceiptDate}',
                               b_receptionTime = '${req.body.txtReceiptHour}:${req.body.txtReceiptMin}',
                               b_requestCompany = '${req.body.txtRequestCompany}',
                               b_requestDepartment = '${req.body.txtRequestDepartment}',
                               b_requesterName = '${req.body.txtRequesterName}',
                               b_requesterTel = '${req.body.txtRequesterTel1}-${req.body.txtRequesterTel2}-${req.body.txtRequesterTel3}',
                               b_modelCode = '${req.body.txtModelCode}',
                               b_modelName = '${req.body.txtModelName}',
                               b_receiptContent = '${req.body.txtReceiptContent}',
       
                               b_processName= '${req.body.txtProcessName}',
                               b_processId= '${req.body.txtProcessId}',
                               b_processDepartmentName = '${req.body.txtPorcessDepartmentName}',
                               b_processDepartmentCode = '${req.body.txtPorcessDepartmentCode}'
                               `                    
            
            const conn = mysql2.createConnection(dbconn.getDbInfo)
            const queryInsert = conn.query(b_query,(err,result,fields)=>{
                
                //console.log(queryInsert.sql)

                let b_inserId = result.insertId                 
                let b_query = `UPDATE SMIS SET 
                                b_state=3,                          
                                b_updatedDate= now(),                           
                                b_ProcessedDate = '${req.body.txtProcessedDate}',
                                b_ProcessedTime = '${req.body.txtProcessedHour}:${req.body.txtProcessedMin}',                          
                                b_category= '${req.body.sltCategory1 + '-' + req.body.sltCategory2 + '-' + req.body.sltCategory3}',
                                b_processedContent= '${req.body.txtProcessedContent}' 
                                WHERE b_idx= '${b_inserId}' `             
                
                //const conn2 = mysql2.createConnection(require('../config/appConfig').getDbInfo)
                const queryUpdate = conn.query(b_query,(err,result,fields)=>{ 
                res.send(`<script>
                            alert('접수/처리완료');
                            location.href='/smis/content?idx=${b_inserId}&state=3';
                        </script> `)

                //console.log(queryUpdate.sql)
                })                  
            })              
    }
})



module.exports = router