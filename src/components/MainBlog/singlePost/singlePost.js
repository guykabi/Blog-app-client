import './singlePost.css'
import axios, {Axios} from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const SinglePost = (props) =>{
    const [postData,setPostData]=useState(null)
    const [comment,setComment]=useState({})
    const [userData,setUserData]=useState(null)
    const [changeToGetExtraData,setChangeToGetExtraData]=useState(false)
    let [numOfLike,setNumOfLike]=useState(0)
    const {id} = useParams()
    const PF = 'http://localhost:8000/images/'

    useEffect(()=>{
        const getPostData =async ()=>{
          const session = JSON.parse(localStorage.getItem('tokenData'))
          setUserData(session)
        try{

          const {data:res}=await axios.get('http://localhost:8000/api/posts/'+id)
          if(res)
          {
            setPostData(res)
            if( res[0].Likes.length === 0)
            {
              setNumOfLike(0)
            }
            else{
            res[0].Likes.forEach(l=> setNumOfLike(numOfLike+1))
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
       const getExtraTimeData = async ()=>{
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

    const handleComment = (e)=>{
       const {name,value}=e.target 
       setComment({...comment,[name]:value})
    } 

    const submitComment =async()=>{
      let obj = {Comments:[{Username:userData.Data.Name,Content:comment.Content}]} 
      try{
           const {data:res} = await axios.patch('http://localhost:8000/api/posts/'+id,obj)
           if(res === 'Comment has been made'){
              setChangeToGetExtraData(!changeToGetExtraData)//Trigger the useEffect that gets the new data
           }
      }catch(err)
      {
        console.log(err)
      }
    }


    return(
        <div className='mainDivSinglePost'>
              <div className='imageDiv2'>
                <img  src={PF+postData?.[0]?.Image} alt="i" />
                 <div className="overlay"></div>
              </div> 
              <div className='postDetailsDiv'>
                 <h2>{postData?.[0]?.Title}<span>❤️️{numOfLike}</span></h2>   
                 <span>{postData?.[0]?.Name}&nbsp;is: {postData?.[0]?.Subtitle}</span> <br />
                 <h4>{postData?.[0]?.Content}</h4> <br />
                 <input onChange={handleComment} name='Content' className='commentInput' type="text" placeholder={'Say somthing nice to'+' '+`${postData?.[0]?.Name}`}/>
                  <button onClick={submitComment}>Send</button> 
                 <div className='comments'>
                 {postData?.[0]?.Comments?.map(c=>(
                      <div className='singleComment'>
                        <span 
                        style={{float:'left',
                        border:'solid black 1px',
                        borderRadius:'50%',
                        padding:'0.4rem'}}>
                        {c.Username.slice(0,1)}
                          </span> <br />
                         {c.Content}
                         <span onClick={()=>{alert('djnwdj')}} className='deleteSignComment'>x</span>
                   </div> 
                 ))}
                 </div>
              </div> <br /> <br />
             
        </div>
    )
}
export default SinglePost