import './reset.css'
import { useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import axios from 'axios'

const Reset = (props) =>{
    const [divSwitch,setDivSwitch]=useState(true)
    const [vsignSwitchCode,setVsignSwitchCode]=useState(true)
    const [vsignSwitchInput,setVsignSwitchInput]=useState(true)
    const [newPassword,setNewPassword]=useState({})
    const navigate = useNavigate()
    const {state} = useLocation();
   
    
  const verifyCode = (e) =>{
        if(+e.target.value === state.state2)
        {
                setVsignSwitchCode(false)
        }
  } 

  const handleNewPassword =(e)=>{
        const{name,value}= e.target
        setNewPassword({...newPassword,[name]:value})
         setVsignSwitchInput(true)
       if(e.target.value === newPassword.Password || e.target.value === newPassword.confirmpassword){
           setVsignSwitchInput(false)
       }
  } 

  const sendNewPaswword = async(e)=> {
    e.preventDefault()
    try{
        let {data:res}=await axios.put('http://localhost:8000/api/users/'+state.userId,{Password:newPassword.Password})
        console.log(res)
    }catch(err)
    {
        console.log(err)
    }
  }

    return(
        <div>
                {divSwitch?<div className='formDivReset'>
                        <h1>Reset Password</h1>
                        <form onSubmit={sendNewPaswword}>
                                <input type="text" disabled={!vsignSwitchCode} className={vsignSwitchCode?null:'vsign'} placeholder='Verify code' onChange={verifyCode} name="verifycode"/><br /> 
                                <input type="password" disabled={vsignSwitchCode} required min={6} onChange={handleNewPassword} placeholder='New password' name="Password" /><br />
                                <input type="password" disabled={vsignSwitchCode} required min={6} className={vsignSwitchInput?null:'vsign'} onChange={handleNewPassword} placeholder='Confirm password' name="confirmpassword" /><br /> <br />
                                <button disabled={vsignSwitchInput} className='resetbtn'>Send</button>&nbsp;<button className='returnbtn' onClick={()=>navigate('/')}>Return</button>
                        </form>
                </div>
                :<div>
                    
                </div>}
        </div>
    )
}
export default Reset