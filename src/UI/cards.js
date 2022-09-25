import './cards.css'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React,{ useEffect, useState,useContext, useMemo } from 'react';
import Context from '../context/Context';
import { useNavigate } from 'react-router-dom';
import axios, {Axios} from 'axios'

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

const Cards = (props) =>{

  const [expanded, setExpanded] = useState(false);
  const ctx = useContext(Context) //Context
  const [like,setLike]=useState(false) //Change like sign
  const userData =  JSON.parse(localStorage.getItem('tokenData'))//Pulling out the data from the localstorgae
  const PF = 'http://localhost:8000/images/'
  const navigate = useNavigate()
  console.log('card load')
  const handleExpandClick = () => {
    setExpanded(!expanded);
  }; 
  
  const changeLike = async ()=>{
    const session = userData
    if(like === false)//If the post doesnt get like from the user
    {
    let obj = {Likes:[{Username:session.Data._id}]}
    try{
          let {data:res}=await axios.patch('http://localhost:8000/api/posts/'+props.data._id,obj)
          if(res === 'Liked has been made')
          {
            setLike(!like)
          }
          else{
            setLike(like)
          }

    }catch(err)
    {
         console.log('Error')
    }
   }
   if(like === true)
   {
    let usersLike = props.data.Likes.find(like => like.Username === session.Data._id )//Finds the users like to that post
    let obj = {Likes:[{Username:session.Data._id,_id:usersLike._id}]}
    try{
          let {data:res}=await axios.patch('http://localhost:8000/api/posts/'+props.data._id,obj)
          if(res === 'Like deleted')
          {
            setLike(!like)
          }
          else{
            setLike(like)
          }

    }catch(err)
    {
         console.log('Error')
    }
   }
  }    
  useEffect(()=>{
    //Generate random color 
    let ifLike =  props.data.Likes.find(like => like.Username === userData.Data._id)//Checks if the post got like by the user
    if(ifLike)
    {
      setLike(true)
    }
    else{
      setLike(false)
    }
  },[])

  const deletePost =async () =>{
         ctx.setVal('deletePost',[{'myPostIdToDelete':props.data._id,'state':true}])
  }
  

  

    return(
        <Card  elevation={9} style={{background:'rgba(245, 245, 245, 0.401)',borderRadius:'12px',marginLeft:'12rem',marginBottom:'2rem'}} className='card'>
          {props?.isDeleted&&<div onClick={deletePost} className='deleteSignCard'>x</div>}
            <CardHeader  title={props.data.Title} titleTypographyProps={{variant:'h6' }}
             avatar={props.isAvatar?null:
                <Avatar 
                  onClick={()=>{navigate('/main/singleUser/'+props?.data?.UserId)}}
                  src={props?.data?.ProfileImage?PF+props?.data?.ProfileImage:null}
                  style={!props?.data?.ProfileImage?{backgroundColor:'#'+props?.data?.Color,cursor:'pointer'}:null}
                  aria-label="recipe">
                 {!props?.data?.ProfileImage&&props.data.Name.slice(0,1)}
                </Avatar>
              }/>
            <CardMedia
            onClick={()=>{navigate('/main/singlePost/'+props?.data?._id)}}
            style={{cursor: 'pointer'}}
             component="img"
              height="194"
              image={PF+props?.data?.Image}
             />
           <CardContent>
             <Typography variant="body2" color="text.secondary">
                 {props.data.Subtitle}
             </Typography>
           </CardContent>
           <CardActions disableSpacing>
             <IconButton onClick={changeLike} aria-label="add to favorites">
               <FavoriteIcon  sx={like?{ color: 'red' }:{color:'gray'}}  />
             </IconButton>
             <ExpandMore
               expand={expanded}
               onClick={handleExpandClick}
               aria-expanded={expanded}
               aria-label="show more"
              >
              <ExpandMoreIcon />
             </ExpandMore>
           </CardActions>
        <Collapse  in={expanded} timeout="auto" unmountOnExit>
          <CardContent >
            <Typography  paragraph>
              {props.data.Content}
            </Typography>
            <Typography paragraph>
               
            </Typography>
          </CardContent>
        </Collapse>    
       </Card>
    )
} 
export default Cards