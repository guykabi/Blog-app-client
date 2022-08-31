import './addPost.css'
import {useState,useEffect} from 'react'
import axios, {Axios} from 'axios'


const Addpost = ()=>{
   
  const [tokenData,setTokenData]=useState(null)//State that save the user data
  const [tempBackgroundInput,setTempBackgroundInput]=useState(null)
  const [file,setFile]=useState(null)
  const [postDetails,setPostDetails]=useState({})
  const PF = 'http://localhost:8000/images/'//The path to saved images in the server


   useEffect(()=>{
      const session = JSON.parse(localStorage.getItem('tokenData'))//Pulling out the data from the localstorgae
      setTokenData(session)
  },[]) 

  
  const handlePostDeatils = (e)=>{
    
    if(e.target.name === 'Image')
     {
      
      setPostDetails({...postDetails,[e.target.name]:Date.now() + e.target.files[0].name})
      setFile(e.target.files[0])
      setTempBackgroundInput(URL.createObjectURL(e.target.files[0]))
     }
     else{
        const {name,value}=e.target 
        setPostDetails({...postDetails,[name]:value})
     }
 }  

 const sendPost =async(e)=>{

       e.preventDefault()
        
       if(file)
       {
        let obj = postDetails
        obj.UserId=tokenData.Data._id
        obj.Name=tokenData.Data.Name
        const data = new FormData()
        const fileName = postDetails.Image
       
        data.append("name",fileName)
        data.append("file",file) 

    try{
      
      const {data:res} = await axios.post('http://localhost:8000/api/upload',data)//Setting images inside the server public file
      if(res === 'Image added')
      {
        try{
           const {data:res2}=await axios.post('http://localhost:8000/api/posts',obj)//Setting the new post inside the database
           console.log(res2)
        }catch(error)
        {
          console.log(error)
        }
      }
    }catch(err)
    {
       console.log(err)
    }
   }
 }


 
    return(
        <div className='mainDiv'>
         <div className='centralDiv'>
           <h1> What is your next post {tokenData?.Data?.Name} ? </h1> <br />
           <div>
             <form onSubmit={sendPost} className='formAddPost'>
                <input required onChange={handlePostDeatils} type="text" name='Title' placeholder='Title' /> <input required onChange={handlePostDeatils} type="text" name='Subtitle' placeholder='Feeling...' /> <br /> <br />
                <textarea required onChange={handlePostDeatils} className='addPostTextArea' placeholder='Tell us about your experience' name="Content" cols="50" rows="4"></textarea> <br />
                <input required onChange={handlePostDeatils} style={tempBackgroundInput?{backgroundImage:`url(${tempBackgroundInput})`}:{backgroundImage:`url(${PF+'camera.jpg'})` }} id='uplaodImageInput'  type="file" name='Image' />
                <br />
                <button className='btnSubmit' type='submit'>Create!</button>
             </form>
           </div>
           </div>
        </div>
    )
}
export default Addpost