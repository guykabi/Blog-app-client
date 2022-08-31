import { useState,useRef } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import axios from 'axios'
import './login.css' 



const Login = (props) =>{ 
   const [loginDetails,setLoginDetails]=useState({}) //Set the username and password which the user typed
   const [incorrectDetail,setIncorrectDetail]=useState(null)//Take the error message from the server if there is
   const [emailObj,setEmailObj]=useState({}) //Set the email to check its validity send the code to that email
   const [resetByEmailBoolean,setResetByEmailBoolean]=useState(false) //Trigger the reset password section/input
   const [emailExists,setEmailExists]=useState(false)//Boolean to check if the email address the user provided is exists 
   const [atSign,setAtSign]=useState(false)//Checks if the atSign is included inside the email provided
   const navigate = useNavigate() 
   const inputRef = useRef()

     const userDetails = (e) =>{//Sets the user username and password into state object
       const{name,value}=e.target 
       setLoginDetails({...loginDetails,[name]:value}) 
     }

     const checkUser = async(e) =>{//Checks the user username and password
      e.preventDefault()
        try{
             let {data:res} = await axios.post('http://localhost:8000/api/users',loginDetails)
             if(res === 'User does not exist' || res === 'Invalid password'){
                 setIncorrectDetail(res)
             } 
             else{
               localStorage.setItem('tokenData',JSON.stringify(res))
               navigate('/main/allPosts') 
             }
        }catch(err)
        {
            console.log('errorrrr')
        }
                                                        
     }  

     const emailCheck =async () =>{//Checks if the email exists in the database
      if(!emailObj.Email.includes('@'))
      {
        setAtSign(true)
        setTimeout(()=>{
           setAtSign(true)
        },)
      }
      else{

      try{

        let {data:res}= await axios.get('http://localhost:8000/api/users/'+emailObj.Email)//Checking if the email exists in the database
         if(res === 'Email is not exists')
         {
            inputRef.current.value = ''
            setEmailExists(true)
            setTimeout(()=>{
              setEmailExists(false)
            },2000)
           
         }
         else{
           setEmailExists(true)
           const {data:res2} =await axios.post('http://localhost:8000/api/mail/',{Email:emailObj.Email,name:res.userName.Name})
           navigate('reset',{state:{state2:res2,userId:res.userName._id}})//Passing the email verify code and user id 
           
         }
        }catch(err)
        {
              console.log(err)
        }
      }
     }
    

     const handleEmailType = (e)=>{ //Function that set the email of the user who forgot his password
       const {name,value}= e.target 
       setEmailObj({...emailObj,[name]:value})
     }
     

    return(
             <div className='mainlogindiv'>
                   <div className='form-header'>
                      <h1>🔒</h1>
                      <h3>Log in</h3>
                   </div>
                   {incorrectDetail && <span style={{marginLeft:'2rem'}}>{<Alert sx={{ width: '60%',marginLeft:'3rem' }} variant="outlined" severity="error">
                                                     {incorrectDetail}</Alert>}</span>}
                   <br /> 
                   <div className='login-form-wrapper'>
                      <form onSubmit={checkUser} className='form'>
                             <input required placeholder='Username' type="text" onChange={userDetails} name="Username"  /> <br />
                             <input required placeholder='Password' type="password" onChange={userDetails} name="Password"  /><br />
                             <button type='submit'>LOG IN</button>
                      </form> 
                      <Link to={'signup'} style={{fontSize:'small',color:'blue'}}>Dont have an account?</Link>&nbsp; 
                      <span  onClick={(e)=>{setResetByEmailBoolean(!resetByEmailBoolean)}} 
                      style={{fontSize:'small',
                      cursor:'pointer',
                      color:'blue',
                      textDecoration:'underline'}}>
                      Forgot password?</span>
                       <br /><br />
                      {resetByEmailBoolean&&<div> {/*The div of inserting the email to send the code*/}
                        <input ref={inputRef} className='resetInput' placeholder={emailExists?'Email is not exists':'Insert Email'} type="text" name='Email' onChange={handleEmailType} /> <br />
                        {atSign&&<span>Email must include - @</span>}<br />
                        <button onClick={emailCheck} className='resetbtn'>Reset</button>
                      </div>}
                   </div>
             </div>
    )
} 

export default Login