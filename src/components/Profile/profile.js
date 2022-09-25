import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './profile.css'

const Profile = (props)=>{

   const [tokenData,setTokenData]=useState(null)
   const [file,setFile]=useState(null)
   const [tempImage,setTempImage]=useState(null)
   const navigate = useNavigate()
   const [user,setUser]=useState(null)
   const [bool,setBool]=useState(true)
   const [change,setChange]=useState(true)
   const [change1,setChange1]=useState(true)
   const [change2,setChange2]=useState(true)
   const [change3,setChange3]=useState(true)
   const PF = 'http://localhost:8000/images/' // The address to the images that stored in the backend


    useEffect(()=>{
      
        const session = JSON.parse(localStorage.getItem('tokenData'))//Pulling out the data from the localstorgae
        const getData = async ()=>{
          try{
              const {data:res}= await axios.get('http://localhost:8000/api/users/'+session.Data._id)
              setTokenData(res)
          }catch(err)
          {
            console.log(err)
          }
        }
        getData()
      
    },[]) 


    const changeDetails =  (e)=> //Building the user changed details and the file object
    { 
        if(e.target.files)
        {
        setFile(e.target.files[0])

        }
        const {name,value}=e.target 
        setUser({...user,[name]:value}) 
    } 

    const sendPost =async(e)=>{

          e.preventDefault()

         if( user === null && file === null)
         {
            setBool(false)
            setTimeout(()=>{
                setBool(true)
            },2000)
          
         }
         else{
            if(file)//Only if the user choose an image
            {
 
            const data = new FormData()
            const fileName = user.Image
        
            data.append("name",fileName)
            data.append("file",file) 
        
          try{
       
            const {data:res} = await axios.post('http://localhost:8000/api/upload',data)//Setting images inside the server public file
            if(res === 'Image added')
            {
              let obj = {'ProfileImage':user.Image}
              
              try{
                const {data:resp} =await axios.patch('http://localhost:8000/api/posts/'+tokenData?.[0]._id,obj)
                const {data:res2} = await axios.patch('http://localhost:8000/api/users/'+tokenData?.[0]._id,user)
                if(resp === 'ProfileImages Updated')
                {
                  navigate('/main/allPosts')
                }
              }catch(err)
              {
                  console.log('Error')
              }
            }
             
          }catch(err)
            {
             console.log(err)
            }
     
           }
          else{
          try{
              const {data:res} = await axios.patch('http://localhost:8000/api/users/'+tokenData?.[0]._id,user)
              
           }catch(err)
             {
               console.log(err)
             }
    }
   }
  } 

  //If user wants to delete is profile image
  const deleteProfileImage =async ()=>{
    try{
      let obj ={'Image':''} //Set empty image field
      let obj2 = {'ProfileImage':''} //Set in all the user posts empty profile image
      
       const {data:resp} = await axios.patch('http://localhost:8000/api/users/'+tokenData?.[0]._id,obj)
       const {data:res}= await axios.patch('http://localhost:8000/api/posts/'+tokenData?.[0]._id,obj2)
       console.log(res)
       if(res === 'ProfileImages Updated')
       {
        
        navigate('/main/allPosts')
       }
    }catch(err){
      console.log(err)
    }
  }

  

   //Edit user details fileds
     const edit = ()=>{
       setChange(!change)
     }
     const edit1 = ()=>{
        setChange1(!change1)
      }
     const edit2 = ()=>{
       setChange2(!change2)
     }  
     const edit3 = ()=>{
       setChange3(!change3)
     }


    return(
        <div className='mainProfileDiv'>
              <h2>{tokenData?.[0]?.Name + " " + tokenData?.[0]?.Lastname }</h2>  
              <form className='formDiv' onSubmit={sendPost}>  
                    <div className='userImageDiv'>
                             {/*Input of type file to choose the image of the profile image*/}
                            <input style={tempImage?{backgroundImage:`url(${tempImage})`}:{backgroundImage: `url(${tokenData?.[0]?.Image?PF+tokenData?.[0]?.Image:PF+'noAvatar.png'})`}} onChange={event =>{
                               const file = event.target.files[0]
                               setUser({...user,['Image']:Date.now()+file.name})   /*Creating or updating the Image field of the user data*/
                               setFile(file)
                               setTempImage(URL.createObjectURL(file))
                            }} 
                            id='customFile'
                            className='fileInput'
                            accept='.jpg,.png,.jpeg'
                            type="file" 
                             />
                              {tempImage&&<button onClick={()=>(setTempImage(null),setFile(null),setUser({...user,['Image']:null}))} className='deleteImage'>X</button>} {/*Button to delete the chosen image*/}
                              {tokenData?.[0]?.Image&&<span onClick={deleteProfileImage} className='removeImage'>Remove profile Image</span>}

                        
                    </div> <br /> 
                      {!bool && <div className='change'>
                               You didnt change nothing
                      </div>}
                    <div className='detailsform'>
                             <span  onClick={edit} className='pencil'>✏️</span>   <input disabled={change} type="text" className='fullname' defaultValue={tokenData?.[0]?.Name} placeholder='Fullname' required name="Name" onChange={changeDetails}  /><br />
                             <span  onClick={edit1} className='pencil'>✏️</span>   <input disabled={change1} type="text" className='Lastname' defaultValue={tokenData?.[0]?.Lastname} placeholder='Lastname' required name="Lastname" onChange={changeDetails}  /><br />
                             <span onClick={edit2}   className='pencil'>✏️</span>  <input disabled={change2} type="text" defaultValue={tokenData?.[0]?.Email} placeholder='Email' required name="Email"  onChange={changeDetails}  /><br />
                             <span  onClick={edit3}  className='pencil'>✏️</span>  <input disabled={change3} type="text" defaultValue={tokenData?.[0]?.Username} placeholder='Username' required name="Username"  onChange={changeDetails}  /><br />
                             <button className='btnSubmit' type='submit'>Save</button> &nbsp; <button className='btnSubmit' onClick={()=>navigate('/main/allPosts')}>Return</button>
                    </div> 

                 </form>
              
        </div>
    )
}
export default Profile