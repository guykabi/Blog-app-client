import axios from 'axios'
import { useEffect, useState,useRef } from 'react'
import {useNavigate} from 'react-router-dom'
import './signUp.css'
import Alert from '@mui/material/Alert';




const SignUp = (props)=>{ 
  const [newUser,setNewUser]=useState({}) //Saves all the new user data that is typed into the form
  const[passwordObj,setPasswordObj]=useState({})//The state goal is to check if the confirmpassword and the password are equal
  const [disableButton,setDisableButton]=useState(true) //Enable and disable the set form button
  const [incorrectDetail,setIncorrectDetail]=useState(null) //Trigger the error message when necessary
  const [formChecklist,setFormChecklist]=useState({email:false,password:false}) //Checks if all the email is not taken and the password is confirmed
  const [confirmPass,setConfirmPass]=useState(false)//Trigger the V sign in the confirmpassword input
  const [divSwitch,setDivSwitch]=useState(true)
  const navigate = useNavigate() 
  

  const userDetails = (e)=>{ //The new user building function

    if(e.target.name !== 'confirmpassword')
    {
      const {name,value}=e.target 
      setNewUser({...newUser,[name]:value})
    }

    if(e.target.name === 'confirmpassword' || e.target.name === 'Password')//Checks if the passwords inputs are equal
    {  
        const {name,value}=e.target
        setPasswordObj({...passwordObj,[name]:value})
        setConfirmPass(false)
        setFormChecklist({...formChecklist,password:false})

        if( e.target.value === newUser?.Password || e.target.value === passwordObj?.confirmpassword  )
        {
          setConfirmPass(true)
          setFormChecklist({...formChecklist,password:true})
        }
    }
  } 

  const sendNewUser = async (e) =>{ //The send form function
    e.preventDefault()
    try{

          let {data:res}= await axios.post('http://localhost:8000/api/users',newUser)
    
          setDivSwitch(false)
          setTimeout(()=>{
             navigate('/')
        },2500)
      }catch(err)
      {
        console.log(err)
      }
  } 

   const emailCheck = async()=>{//Checks if the email is already exsits in the database
      let {data:res}= await axios.get('http://localhost:8000/api/users/'+ newUser.Email)
      if(res === 'Email already exists')
      {
         setIncorrectDetail(res)
         setDisableButton(true)
         setFormChecklist({...formChecklist,email:false})
      }
      else{
        setFormChecklist({...formChecklist,email:true})
        setIncorrectDetail(null)
        
      }
   } 

   useEffect(()=>{ //Checks if all the requiremnts of the form are fullfilled
     if(formChecklist.email == true && formChecklist.password == true)
      {
        setDisableButton(false)
      }
      else{
        setDisableButton(true)
      }
   },[formChecklist])

  return( 
    <div className='mainDiv'>
      
           {divSwitch ?<div className='formDiv'>
               <h1>Sign Up</h1>
               {incorrectDetail && <span style={{marginLeft:'2rem'}}>
                                     {<Alert sx={{ width: '60%',marginLeft:'3rem' }} variant="outlined" severity="error">
                                      {incorrectDetail}
                                      </Alert>}
                                  </span>}
               <form className='signupForm' onSubmit={sendNewUser}>
                  <input type="text" onChange={userDetails} required placeholder='First name' name='Name' /> <br />
                  <input type="text" onChange={userDetails} required placeholder='Last name' name='Lastname' /> <br />
                  <input type="text" onChange={userDetails} onBlur={emailCheck} required placeholder='Email' name='Email' />
                  <input type="number" onChange={userDetails}  required placeholder='Age' name='Age' />
                  <input type="text" onChange={userDetails} required placeholder='Username' name='Username' />
                  <input type="password" onChange={userDetails} required placeholder='Password' name='Password' />
                  <input type="password" onChange={userDetails} required className={confirmPass? 'confirmInput' : null} placeholder='Confirm password' name='confirmpassword' /> <br /> <br />
                  <button type='submit' disabled={disableButton} className='signupbtn'>Sign Up</button> &nbsp; <button className='returnbtn' onClick={()=>navigate('/')}>Return</button>
               </form>
           </div> :
            <div style={{textAlign:'center',marginTop:'15rem'}}>
                   <h2>{newUser.Name},Your registration is accepeted</h2>
           </div>}
    </div>
  )
} 

export default SignUp