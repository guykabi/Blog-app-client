import './reset.css'
import { useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import axios from 'axios'

const Reset = () =>{
    const [divSwitch,setDivSwitch]=useState(true) //Boolean to control the divs display
    const [messageText,setMessageText]=useState(null) //The message that will present when success or failure
    const [vsignSwitchCode,setVsignSwitchCode]=useState(true)//Boolean to control the vSign that checks the email code
    const [vsignSwitchInput,setVsignSwitchInput]=useState(true)//Boolean to control the vSign that check if the passwords are equal 
    const [newPassword,setNewPassword]=useState({})//State of the new chosen password
    const navigate = useNavigate()
    const {state} = useLocation(); //Take the passed email code from the previouse page
   
    
  const verifyCode = (e) =>{ //Checks if the code sent by email is correct
        if(+e.target.value === state.state2)
        {
                setVsignSwitchCode(false)
        }
  } 

  const handleNewPassword =(e)=>{ //Set the password and verifies it again!
        const{name,value}= e.target
        setNewPassword({...newPassword,[name]:value})
         setVsignSwitchInput(true)
       if(e.target.value === newPassword.Password || e.target.value === newPassword.confirmpassword){
           setVsignSwitchInput(false) //Trigger the vSign mark inside the confirm password input
       }
  } 

  const sendNewPaswword = async(e)=> { //Submiting the new password chosen
    e.preventDefault()
    try{
        let {data:res}=await axios.put('http://localhost:8000/api/users/'+state.userId,{Password:newPassword.Password})
        setDivSwitch(false)
        setMessageText('Your password has change!')
        setTimeout(()=>{
          navigate('/')
        },[2000])
        
    }catch(err)
    {
        setDivSwitch(false)
        setMessageText('Something went wrong, try again!')
        setTimeout(()=>{
          navigate('/')
        },2000)

    }
  }

    return(
        <div>
                {divSwitch?<div //Chnaging the password form
                        className='formDivReset'>
                        <h1>Reset Password</h1>
                        <form onSubmit={sendNewPaswword}>
                                <input type="text" disabled={!vsignSwitchCode} className={vsignSwitchCode?null:'vsign'} placeholder='Verify code' onChange={verifyCode} name="verifycode"/><br /> 
                                <input type="password" disabled={vsignSwitchCode} required min={6} onChange={handleNewPassword} placeholder='New password' name="Password" /><br />
                                <input type="password" disabled={vsignSwitchCode} required min={6} className={vsignSwitchInput?null:'vsign'} onChange={handleNewPassword} placeholder='Confirm password' name="confirmpassword" /><br /> <br />
                                <button disabled={vsignSwitchInput} className='resetbtn'>Send</button>&nbsp;<button className='returnbtn' onClick={()=>navigate('/')}>Return</button>
                        </form>
                </div>
                :<div  //Error message or success message when updating the user password
                style={{textAlign:'center',
                marginTop:'2rem',
                fontSize:'large'}}>
                {messageText}
                </div>}
        </div>
    )
}
export default Reset