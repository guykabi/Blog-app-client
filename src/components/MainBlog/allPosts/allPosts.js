import Grid from '@mui/material/Grid';
import Cards from '../../../UI/cards'
import './allPosts.css'
import Context from '../../../context/Context';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';


const AllPosts = (props)=>{
  const ctx = useContext(Context) //Context 
  const [posts,setPosts]=useState(null)//All the posts
 

useEffect(()=>{
  const session = JSON.parse(localStorage.getItem('tokenData')) //The user data + token
  const getAllPosts =async ()=>{
   
    try{
     const {data:res}=await axios.get('http://localhost:8000/api/posts',{
      headers: {
        'x-access-token': session.accessToken //Sending the token to the server to verify the user entrance
        }})
     setPosts(res)
     
      }catch(err)
      {
        console.log('here its become true')
        ctx.setVal(true)//Trigger the error message if no token provided
      }
  }
  getAllPosts()
},[])



  return(
    <> 
          <div className='allPostsDiv'>
                {posts?.map((post,index)=>( //All posts rendered into cards
                        <Cards  key={index} data={post} />
                   ))}              
             </div>
             <div className='popolarDiv'>
                <h2 className='popolarPostsHeader'>Popular Posts</h2>
                <Grid container spacing={-50}>
                {posts?.slice(0,2)?.map((post,index)=>( //Will be the top 5 most liked posts
                  <Grid item xs={6}> 
                        <Cards   key={index} data={post} />
                  </Grid>
                   ))}
                </Grid>
             </div>
    </>
  )
}

export default AllPosts