import './myPosts.css'
import Grid from '@mui/material/Grid';
import {useState,useEffect,useContext} from 'react'
import Context from '../../../context/Context'
import axios from 'axios'
import Cards from '../../../UI/cards'


const MyPosts = (props)=>{
  
    const [userData,setUserData]=useState(null)//State that save the user data
    const [posts,setPosts]=useState(null)
    const ctx = useContext(Context) //Context

    useEffect(()=>{
        const getUserPosts =async ()=>{
        const session = JSON.parse(localStorage.getItem('tokenData'))//Pulling out the data from the localstorgae
        setUserData(session)
        try{
            const {data:res}=await axios.get('http://localhost:8000/api/posts/'+session.Data._id)
            setPosts(res)
        }catch(err)
        {
              console.log(err)
        }
    } 
    getUserPosts()
    },[]) 
    
   
  useEffect(()=>{

    const refreshMyPosts =async ()=>{
        if(ctx.val.refreshMyPostData === true)
        {
        try{
            const {data:res}=await axios.delete('http://localhost:8000/api/posts/'+ctx?.val?.deletePost?.[0]?.myPostIdToDelete)
            if(res === 'Deleted')
            {
                try{
                    const {data:res2}=await axios.get('http://localhost:8000/api/posts/'+userData.Data._id)
                    setPosts(res2)
                    ctx.setVal('deletePost',[{'myPostIdToDelete':null,'state':false}])
                }catch(err)
                {
                      console.log(err)
                }
            }
           }catch(err)
           {
              console.log('Error')
           }
       
    }
}
    refreshMyPosts()
},[ctx.val.refreshMyPostData])


if(posts?.length < 1)
{
    return <div className='noMyPosts'>
             <h1>You dont have any posts!</h1> <br />
            <h4>You need to share some stuff</h4>
    </div>
}
   

    return(
        <>
       <div className='myPostsDiv'> <br />
           <h1>My Posts</h1> <br /> 
           <div className='innerMyPostsDiv'>
           <Grid container spacing={-20}>
           {posts?.map((post,index)=>( //All posts rendered into cards
            <Grid key={index} item xs={4}> 
                        <Cards  key={index+Date.now()}  isDeleted={true} data={post} />
                        </Grid> 
                   ))}  
                     </Grid>         
           </div>
           

       </div>
       </>
    )
} 
export default MyPosts