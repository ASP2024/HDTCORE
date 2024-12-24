function nextfocusControl(id) {
    if(event.keyCode == 13) {
         document.getElementById(id).focus()               
    }
}


function focusControl(id){                        
              
    //document.getElementById(id).style.backgroundColor = '#E8F0FE'
    //document.getElementById(id).style.borderColor = '#3C59E7'   
    //document.getElementById(id).style.backgroundColor = '#000080'
    document.getElementById(id).style.backgroundColor = '#F0F8FF' 
    document.getElementById(id).style.borderColor = '#000080'
    //document.getElementById(id).style.color = 'white'
    return false
}
function blurControl(id){               
    
    document.getElementById(id).style.backgroundColor = 'white'
    document.getElementById(id).style.borderColor = ''                               
    return false
}


function keydown_txtRequesterTel3(){
    if(event.keyCode == 13) {
        searchRequestCompanyInfo()            
    }
}
function searchRequestCompanyInfo() {
    if(document.getElementById('txtRequesterTel1').value == '' || document.getElementById('txtRequesterTel2').value == '' || document.getElementById('txtRequesterTel3').value == ''){
        alert('전화번호를 입력해 주세요')
        return false
    } 
      fetch('/smis/content/searchRequestCompanyInfo',{
        method: 'POST',
            headers: {
            'Content-Type':'application/json'
            },
            body: JSON.stringify({ 
            'tel':document.getElementById('txtRequesterTel1').value + '-' +
                  document.getElementById('txtRequesterTel2').value + '-' +
                  document.getElementById('txtRequesterTel3').value
        })
      })
      .then((res)=>res.json())
      .then((b_result)=>{
            
            if(b_result.isExists == 'true') {

                document.getElementById('txtRequestCompany').value = b_result.RequestCompany
                document.getElementById('txtRequestDepartment').value = b_result.RequestDepartment               
                document.getElementById('txtRequesterName').value = b_result.RequesterName 
                document.getElementById('txtRequesterName').focus()                                    
            } else {                     
                document.getElementById('txtRequestCompany').value = ''
                document.getElementById('txtRequestDepartment').value = ''            
                document.getElementById('txtRequesterName').value = ''                                       
                alert('처음 고객입니다.')
                document.getElementById('txtRequestCompany').focus()
            }
           
                     
      })
      .catch((err)=>{
        alert(err)           
      })
}


 

    // 처리자 부서명,사번,이름 검색     
   function Autocomplete_processId() {
    fetch('/smis/content/Autocomplete_processId',{
        method: 'POST',
        headers: {
        'Content-Type':'application/json'
        },
        body: JSON.stringify({                
            //'id':id                              
        })
    })
    .then((res)=>res.json())
    .then((data)=>{     

        var memberList = data.memberList                                                                                  

        $('#txtProcessName').autocomplete({
            source: memberList,
            change: function(event,ui) { 

            },
            focus: function(event,ui){                                                                                                                           
                return false
            },
            select: function(event,ui) {   
                $('#txtProcessName').val(ui.item.value.substring(0,3))  
                $('#txtProcessId').val(ui.item.value.substring(4,11))
                $('#txtPorcessDepartmentCode').val(ui.item.value.substring(12,16))
                $('#txtPorcessDepartmentName').val(ui.item.value.substring(17,22))                                                                                                                      
                return false   
            },
            minLength: 1,
            delay: 100,
            autoFocus: true     
        })

    }).catch(err,(req,res)=>{
        document.write(err)
    })
}





$(document).ready(function(){
    
    // only number
    $('#txtRequesterTel2 , #txtRequesterTel1').keyup(function(){
        //$(this).val( $(this).val().replace(/[^0-9]/g,"") )  // only number
        $(this).val( $(this).val().replace(/[^\!-z]/g,"") )     // only Eng
    })
    
    $('input[name=radioChangeProcesser]').change(function() {
        
           if($('input[name=radioChangeProcesser]:checked').val() == 1){
               
                $("#txtProcessName").removeAttr('readonly')
                $("#txtProcessName").val('')
                $("#txtProcessId").val('')
                $('#txtPorcessDepartmentCode').val('')
                $('#txtPorcessDepartmentName').val('')
                
                $("#txtProcessName").attr('placeholder','사번 또는 이름,부서명')
                $("#txtProcessName").focus() 
            
                Autocomplete_processId()  

               
           }else{
                           
                $("#txtProcessName").attr('readonly','readonly')
                $("#txtProcessName").val($('#hiddenUserName').val())
                $("#txtProcessId").val($('#hiddenUserId').val())
                $('#txtPorcessDepartmentCode').val($('#hiddenUserDepartmentCode').val())
                $('#txtPorcessDepartmentName').val($('#hiddenUserDepartmentName').val())        
           }
    })
        
 
       






    function chkValueOfReceiptForm() {
        return true
    }

    function chkValueOfProcessForm() {
        return true
    }    

    $("#submitReceipt").click(function(){    
        if(chkValueOfReceiptForm()) {  // 빈값 체크
            $('#contentForm').attr('action','/smis/content/saveReceipt')
            $("#contentForm").submit(); // Submit the form   
        }            
            
    });

    $("#submitProcess").click(function(){   

        // 본인에게 접수된 자료 여부 확인
        if($('#txtProcessId').val() == $('#hiddenUserId').val()) { // 본인에게 접수된 자료

            if(chkValueOfProcessForm()) {  // 빈값 체크
                $('#contentForm').attr('action','/smis/content/saveProcess')
                $("#contentForm").submit(); // Submit the form 
            }

        } else { // 타인에게 접수된 자료
              alert('타인에게 접수된 자료는 [완료 저장]을 할 수 없습니다.')
        }
               
    }); 
      
        // $('#sltDepartmentList').on('change',function() {
        //     $('#txtdepartmentName').val($('#sltDepartmentList option:selected').attr('value'))
        //     $('#txtdepartmentCode').val($('#sltDepartmentList option:selected').val())
        //     $('#txtdepartmentName').val($('#sltDepartmentList option:selected').text())
        //     $('#sltDepartmentList').css('display','none')
        //     $('#txthp').focus()
        
        // })
    $("#txtModelCode").click(function(){
        $("#txtModelCode").val('')
        $("#txtModelName").val('')                
    })
    $("#txtModelCode").keyup('keyup',function(){
        $('#txtModelCode').val($('#txtModelCode').val().toUpperCase())
    })

     
     
  
        

// 모델코드 검색
    fetch('/smis/content/Autocomplete_modelCode',{
            method: 'POST',
            headers: {
            'Content-Type':'application/json'
            },
            body: JSON.stringify({                
                //'id':id                              
            })
    })
    .then((res)=>res.json())
    .then((data)=>{                    
            
        var modelCode = data.modelCode                                                        
                        
        $("#txtModelCode").autocomplete({
        source: modelCode,
        change: function(event,ui) { // Triggered when the field is blurred, if the value has changed.
            // document.getElementById('txtModelCode').value = $("#txtModelCode").val().split(" ")[0]
            // document.getElementById('txtModelName').value = $("#txtModelCode").val().split(" ")[1]        
        },
        focus: function(event,ui){
            // $('#txtModelCode').val(ui.item.value.split(" ")[0])
            // $('#txtModelName').val(ui.item.value.split(" ")[1])         
            return false
        },
        select: function(event,ui) {
            // document.getElementById('txtModelCode').value = '1'
            // document.getElementById('txtModelName').value = ui.item.value.split(" ")[1]
            $('#txtModelCode').val(ui.item.value.substring(0,4))
            $('#txtModelName').val(ui.item.value.substring(5))
            $('#txtReceiptContent').focus()
            return false
        },
        minLength: 1,
        delay: 100,
        autoFocus: true        
        })

    })
    .catch(err,(req,res)=>{
        document.write(err)
    })





 
        
   




    


})  // End





    


       

       // .autocomplete( "instance" )._renderItem = function( ul, item ) {    //요 부분이 UI를 마음대로 변경하는 부분
        //       return $( "<li>" )    
        //       .append( "<div style='font-size:9pt;'>" + item.value + "</div>"  )    //여기에다가 원하는 모양의 HTML을 만들면 UI가 원하는 모양으로 변함.
        //       .appendTo( ul );
        // };


    
            // txtProcessId
          
                // if($('#chkProcessName').is(':checked')) {
                //     alert('checked')
                //     //$('#chkProcessName').prop('checked',false)
                // } else {
                // alert('is not checked')
                // //$('#chkProcessName').prop('checked',true)
                // }

