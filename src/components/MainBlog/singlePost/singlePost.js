import './singlePost.css'
import axios, {Axios} from 'axios'
import { useEffect, useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import {format} from 'timeago.js'


const SinglePost = (props) =>{
    const [postData,setPostData]=useState(null)
    const [comment,setComment]=useState({})//The comment the user write
    const [userData,setUserData]=useState(null)//The data of the user from the local storage
    const [changeToGetExtraData,setChangeToGetExtraData]=useState(false)
    const [numOfLike,setNumOfLike]=useState(0)
    const [emptyComment,setEmptyComment]=useState(false) //Checks if the user typed anything to the comment input
    const [sureToDelete,setSureToDelete]=useState(null)// Set the chosen comment to delete
    const {id} = useParams()
    const inputRef = useRef()
    const PF = 'http://localhost:8000/images/' //The url of the images file in the server



    useEffect(()=>{
        const getPostData =async ()=>{
          window.scrollTo(0,0)
          const session = JSON.parse(localStorage.getItem('tokenData')) //The user data from localStorage
          setUserData(session)
        try{

          const {data:res}=await axios.get('http://localhost:8000/api/posts/'+id) //Get the specific post data
          if(res)
          {
            setPostData(res)
            if( res[0].Likes.length === 0)//Check if there is no likes
            {
              setNumOfLike(0)
            }
             else
             { 
              let tempLikes = 0 
              res[0].Likes.forEach(like=> tempLikes++) //Counts the number of like that the post recieved
              setNumOfLike(tempLikes) 
             }
            
          }
        }catch(err)
        {
            console.log(err)
        }
    }
    getPostData()
        
    },[]) 

    useEffect(()=>{
       const getExtraTimeData = async ()=>{//Function that get the latest data with the comment that just made
        try{
          const {data:res}=await axios.get('http://localhost:8000/api/posts/'+id)
          if(res)
          {
            setPostData(res)
          }
        }catch(err)
        {
            console.log(err)
        }
       }
       getExtraTimeData()
    },[changeToGetExtraData])

    const handleComment = (e)=>{//Set the comment to the state
      if(!e.target.value)
      {
        setEmptyComment(false)
      }
      if(emptyComment === false)
      {
        setEmptyComment(true)
      }
       const {name,value}=e.target 
       setComment({...comment,[name]:value})
    } 

    const submitComment =async()=>{
      let obj = {Comments:[{Username:userData.Data.Name,Content:comment.Content}]}//Building the object that been sent to the server 
      try{
           const {data:res} = await axios.patch('http://localhost:8000/api/posts/'+id,obj)
           if(res === 'Comment has been made'){
              setChangeToGetExtraData(!changeToGetExtraData)//Trigger the useEffect that gets the new data
              inputRef.current.value = ''
           }
      }catch(err)
      {
        console.log(err)
      }
    }
   useEffect(()=>{
    if(sureToDelete !== null)
    {
    const deletePost= async() =>{
      let obj = {Comments:[{_id:sureToDelete}]}
      try{
        const {data:res}=await axios.patch('http://localhost:8000/api/posts/'+postData[0]._id,obj)
        if(res === 'Comment deleted')
        {
        setChangeToGetExtraData(!changeToGetExtraData)//Trigger the useEffect that gets the new data
        }
      }catch(err)
      {
        console.log(err)
      }
    }
    deletePost()
  }
   },[sureToDelete])
    


    return(
        <div className='mainDivSinglePost'>
              <div className='imageDiv2'>
                <img  src={PF+postData?.[0]?.Image} alt="i" />
                 <div className="overlay"></div>{/*The background that blur the image bottom*/}
              </div> 
              <div className='postDetailsDiv'>
                 <h2>{postData?.[0]?.Title}<span>?????????{numOfLike}</span></h2>   
                 <span>{postData?.[0]?.Name}&nbsp;is: {postData?.[0]?.Subtitle}</span> <br /> <br />
                 <div className='postContenth4'>{postData?.[0]?.Content}</div> <br />
                 <input onChange={handleComment} ref={inputRef} name='Content' className='commentInput' type="text" placeholder={'Say somthing nice to'+' '+`${postData?.[0]?.Name}`}/>
                 <button disabled={!emptyComment} className='btnComment' onClick={submitComment}>Send</button>  <br /> <br />
                 <div className='comments'>
                 {postData?.[0]?.Comments?.map(c=>(
                      <div className='singleComment'> 
                        <span 
                        style={{float:'left',
                        borderBottom:'solid gray 1px',
                        borderRadius:'40%',
                        fontSize:'small',
                        padding:'0.3rem'}}>
                        {c.Username}
                          </span> <br />
                         <div className='commentContentDiv'>{c.Content}</div> &nbsp; <div style={{fontSize:'x-small',float:'right',marginTop:'4%'}}>{format(c.createdAt)}</div>
                         {c.Username === userData.Data.Name&&<span onClick={()=>{setSureToDelete(c._id)}} className='deleteSignComment'>x</span>}{/*Working only if the comment belongs to the user*/}
                   </div> 
                 ))}
                 </div>
              </div> <br /> <br />
             
        </div>
    )
}
export default SinglePost