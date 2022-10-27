import { useState,useRef, useEffect } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import axios from 'axios'
import './login.css' 


const Login = () =>{ 
   const [loginDetails,setLoginDetails]=useState({}) //Set the username and password which the user typed
   const [incorrectDetail,setIncorrectDetail]=useState(null)//Take the error message from the server if there is
   const [emailStr,setEmailStr]=useState('') //Set the email to check its validity send the code to that email
   const [resetByEmailBoolean,setResetByEmailBoolean]=useState(false) //Trigger the reset password section/input
   const [emailExists,setEmailExists]=useState(false)//Boolean to check if the email address the user provided is exists 
   const [atSign,setAtSign]=useState(false)//Checks if the atSign is included inside the email provided
   const [errorText,setErrorText]=useState('')
   const navigate = useNavigate() 
   const inputRef = useRef()

     const userDetails = (e) =>{//Sets the user username and password into state object
       const{name,value}=e.target 
       setLoginDetails({...loginDetails,[name]:value}) 
     }

     useEffect(()=>{
      //Checks if there is a reason to clear the localStorage
      if(localStorage.getItem("tokenData")) 
      {
        localStorage.clear()
      }
     },[])

     const checkUser = async(e) =>{//Checks the user username and password
         e.preventDefault()
         try{
             let {data:res} = await axios.post('/api/users',loginDetails)
             if(res === 'User does not exist' || res === 'Invalid password'){
                 setIncorrectDetail(res)
                 let timer = setTimeout(()=>{
                  setIncorrectDetail(null)
               },3000)
       
               return () => {
                 clearTimeout(timer);
               };
             } 
             else{
               localStorage.setItem('tokenData',JSON.stringify(res))
               navigate('/main/allPosts') 
             }
          }catch(err)
           {   
            setIncorrectDetail(err.message)
            let timer = setTimeout(()=>{
             setIncorrectDetail(null)
          },3000)
  
          return () => {
            clearTimeout(timer);
          };
           }                                                    
      }  

     const emailCheck =async () =>{//Checks if the email exists in the database
      if(!emailStr.includes('@'))
      {
        setAtSign(true)
        let timer = setTimeout(()=>{
           setAtSign(false)
        },2000)

        return () => {
          clearTimeout(timer);
        };
      }
      else{
          try{

            //Checking if the email exists in the database
            let {data:res}= await axios.get('/api/users/'+emailStr)
            if(res === 'Email is not exists')
            {
              inputRef.current.value = ''
              setEmailExists(true)
              setErrorText(res)
              let timer = setTimeout(()=>{
                setEmailExists(false)
              },3000) 

              return () => {
                clearTimeout(timer);
              };
             }
           else{
              setEmailExists(true)
              const {data:res2} =await axios.post('/api/mail/',{Email:emailStr,name:res.userName.Name})
              navigate('reset',{state:{state2:res2,userId:res.userName._id}})//Passing the email verify code and user id 
           
              }
          }catch(err)
            {
              inputRef.current.value = ''
              setEmailExists(true)
              setErrorText(err.message + " - Try again")
              let timer = setTimeout(()=>{
                setEmailExists(false)
              },3000) 

              return () => {
                clearTimeout(timer);
              };
            }
        }
     }
    
    return(
             <div className='mainlogindiv'>
                   <div className='form-header'>
                      <h1>🔒</h1>
                      <h3>Log in</h3>
                   </div>
                   {incorrectDetail && <span style={{marginLeft:'2rem'}}>
                                          {<Alert 
                                          sx={{ width: '60%',height:'80%', margin:'0 auto' }}
                                          variant="outlined" 
                                          severity="error">
                                          {incorrectDetail}
                                          </Alert>}
                                       </span>}
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
                        <input ref={inputRef}
                          className='resetInput' 
                          placeholder={emailExists?errorText:'Insert Email'}
                          type="text" 
                          name='Email' 
                          onChange={(e)=>setEmailStr(e.target.value)} /> <br />
                        {atSign&&<span>Email must include - @</span>}<br />
                        <button onClick={emailCheck} className='resetbtn'>Reset</button>
                        </div>}
                   </div>
             </div>
    )
} 

export default Login