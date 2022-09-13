import './singleUser.css'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react'
import axios from 'axios'
import Cards from '../../../UI/cards'
import Grid from '@mui/material/Grid';
const Singleuser = () =>{
    const {id} = useParams()
    const [userData,setUserData]=useState(null)
    const [userPosts,steUserPosts]=useState(null)
    useEffect(()=>{
        const getUserData = async ()=>{
            try{
                const {data:res}=await axios.get('http://localhost:8000/api/users/'+id)
                if(res !== 'User is not exists')
                {
                 setUserData(res)
                 try{
                    const {data:res2}=await axios.get('http://localhost:8000/api/posts/'+id)
                    if(res2)
                    {
                        steUserPosts(res2)
                    }
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
        getUserData()
    },[])
    return(
        <div className='singleUserMainDiv'>
          <h2>{userData?.[0]?.Name}'s Posts</h2>
            <div className="dataPosts">
            <Grid container spacing={-20}>
              {userPosts?.map((post,index)=>(
                  <Grid item xs={4}> 
                  <Cards  key={index+Date.now()} isAvatar={true} data={post} />
                  </Grid> 
            ))}  
            </Grid>
                     
            </div>
        </div>
    )
} 
export default Singleuser