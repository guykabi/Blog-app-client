import Grid from '@mui/material/Grid';
import Cards from '../../../UI/cards'
import './allPosts.css'
import Context from '../../../context/Context';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AllPosts = (props)=>{
  const ctx = useContext(Context) //Context 
  const navigate = useNavigate()
  const [posts,setPosts]=useState(null)//All the posts
  const[reservePosts,setReservePosts]=useState(null)//Store also the posts but for initailize the posts state after the user search end
  const [mostLikedPosts,setMostLikedPosts]=useState(null)//Store the most liked posts of the week
  const [errorMessage,setErrorMessage]=useState(null)
 

useEffect(()=>{
  const getAllPosts =async ()=>{
    const session = JSON.parse(localStorage.getItem('tokenData')) //The user data + token
   
    try{
     const {data:res}=await axios.get('http://localhost:8000/api/posts',{
      headers: {
        'x-access-token': session.accessToken //Sending the token to the server to verify the user entrance
        }})
       
        if(res !== 'No Token Provided')
        {
          ctx.setVal('errorState',false) //Set the errorState filed in the context to false
          setPosts(res)
          setReservePosts(res)//Set the posts to the reserve posts state
          let mostLikes =  res.slice(0,2) 
          setMostLikedPosts(mostLikes)
        }
     
      }catch(err)
      {
        setErrorMessage(true)
        ctx.setVal('errorState',true)//Trigger the error message if no token provided
      }
  }
  getAllPosts()
},[]) 

useEffect(()=>{
  
   if(ctx.val.searchWord.length === 0)
   {
      setPosts(reservePosts)
   }
   if(ctx.val.searchWord.length > 0)
   {
   let results =  posts?.filter(p=> p.Title.toLowerCase().includes(ctx.val.searchWord.toLowerCase()))
   setPosts(results)
   }
},[ctx.val.searchWord])

if(errorMessage)
{
  return <div className='errormessage'>
         <h1>Cant load page!</h1> <br />
         <button className='errorBtn' onClick={(e)=>navigate('/')}>return to login page</button> <br /> <br /> 
         </div> 
}


  return( 
    <> 
          <div className='allPostsDiv'>
                {posts?.map((post,index)=>( //All posts rendered into cards
                        <Cards  key={index+Date.now()} data={post} />
                   ))}    
                             
             </div>
             <div className='popolarDiv'>
                <h2 className='popolarPostsHeader'>Popular Posts</h2>
                <Grid container spacing={-50}>
                {mostLikedPosts?.map((post,index)=>( //Will be the top 5 most liked posts
                  <Grid key={index} item xs={6}> 
                        <Cards   key={index} data={post} />
                  </Grid>
                   ))}
                </Grid>
             </div>
    </>
  )
}

export default AllPosts