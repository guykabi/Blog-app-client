import Grid from '@mui/material/Grid';
import Cards from '../../../UI/cards'
import './allPosts.css'
import Context from '../../../context/Context';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';



const AllPosts = ()=>{
  const ctx = useContext(Context) //Context 
  const [posts,setPosts]=useState(null)//All the posts
  const[reservePosts,setReservePosts]=useState(null)//Store also the posts but for initailize the posts state after the user search end
  const [mostLikedPosts,setMostLikedPosts]=useState(null)//Store the most liked posts of the week
  const [triggerTopLikes,setTriggerTopLikes]=useState(false)


useEffect(()=>{
  const getAllPosts =async ()=>{
    const session = JSON.parse(localStorage.getItem('tokenData')) //The user data + token
    try{
     const {data:res}=await axios.get('/api/posts',{
      headers: {
        'x-access-token': session.accessToken //Sending the token to the server to verify the user entrance
        }})
       
        if(res !== 'No Token Provided')
        {
          ctx.setVal('errorState',false) //Set the errorState filed in the context to false
          setPosts(res)
          setReservePosts(res)//Set the posts to the reserve posts state
          setTriggerTopLikes(true)
        } 
        if(ctx.val.searchWord.length > 0)//Checks if the search input is not empty when the component is load
        {
          ctx.setVal('deleteSearchWord',true)//The context field that trigger the deletion of the search input
        }
     
      }catch(err)
      {
        ctx.setVal('errorState',true)//Trigger the error message if no token provided
      }
  }
  getAllPosts()
},[]) 

let results;


useEffect(()=>{
  //When search triggered on mainBlog component
   if(ctx.val.searchWord.length === 0)
   {
      setPosts(reservePosts)
   }
   if(ctx.val.searchWord.length > 0)
   {//Filter the post by search word
   results =  reservePosts?.filter(p=> p.Title.toLowerCase().includes(ctx.val.searchWord.toLowerCase()))//Search posts both lowercase and uppercase
   setPosts(results)
   }
},[ctx.val.searchWord])


useEffect(()=>{
  const topfourlikes = ()=>{
  if(triggerTopLikes === true)//Ensure that the function does not rerneder on every render of the component
  {
       let tempArr = []
       let mostLikes=[]
       for(let i=0;i<posts?.length;i++)
        {
              let numsOfLikes = 0
              posts[i].Likes.forEach(like => numsOfLikes++ )
              //Making new array of objects that contains the post and its number of likes
              tempArr.push({numberLikes:numsOfLikes,Post:posts[i]})
        }
        //Making a new array that consists only the number of likes of each post
        let onlyNumberOfLikes = tempArr?.map(t=> t.numberLikes)
        for(let j=0;j<posts?.length;j++)
        {
         let max = Math.max(...onlyNumberOfLikes) 
         let index =  onlyNumberOfLikes.indexOf(max)//Finding the most liked post
         mostLikes.push(tempArr[index].Post)//Push to the final array the matching post by the same index
         onlyNumberOfLikes.splice(index,1)//Remove the most higher number of likes
         tempArr.splice(index,1)//Remove the most liked post
        } 
        setMostLikedPosts(mostLikes)
  }
}
  topfourlikes()
  },[triggerTopLikes])
  


  return( 
    <> 
          <div className='allPostsDiv'>
                {posts?.map((post,index)=>( //All posts rendered into cards
                        <Cards  key={index+Date.now()} data={post} />
                   ))}    
                             
             </div>
             <div className='popolarDiv'>
                <h2 className='popolarPostsHeader'>Popular Posts</h2> <br /> <br />
                <div className='cardsOfPopularDiv'>
                  <Grid container spacing={0}>
                {mostLikedPosts?.slice(0,4).map((post,index)=>( //Will be the top 4 most liked posts
                        <Grid key={index} item xs={6} >
                        <Cards  key={index+Date.now()} data={post} />
                        </Grid>
                   ))}
                   </Grid>
                </div>
             </div>
    </>
  )
}

export default AllPosts