import './mainBlog.css'
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import {useState,useContext, useEffect,useRef} from 'react'
import Context from '../../context/Context';
import {useNavigate,Outlet} from 'react-router-dom'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {SocialIcon} from 'react-social-icons'



const MainBlog = (props) =>{
 
  const navigate = useNavigate()  
  const ctx = useContext(Context) //Context
  const [errorMessage,setErrorMessage]=useState(false)
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [tokenData,setTokenData]=useState(null)
  const [userData,setUserData]=useState(null)
  const PF = 'http://localhost:8000/images/'
  const inputRef = useRef()
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
 
 
  useEffect(()=>{
     const session = JSON.parse(localStorage.getItem('tokenData'))
     setTokenData(session)
     const getUserData =async ()=>{
         const {data:res} = await axios.get('http://localhost:8000/api/users/'+session?.Data?._id)
         setUserData(res)
     }
     getUserData()
  },[])

  useEffect(()=>{
    if(ctx.val.errorState === true)
    {
       setErrorMessage(true)
    }
    if(ctx.val.errorState === false)
    {
      setErrorMessage(false)
    }
  },[ctx.val.errorState])
 
  const handleSearchPost = (e)=>{
    ctx.setVal('searchWord',e.target.value)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const moveToAllPosts = () =>{
    navigate('allPosts')
 } 
  
  const moveToAddPost = () =>{
     navigate('addPost')
  } 

  const moveToMyPosts = ()=>{
    navigate('myPosts')
  }  

  const toLogOut = () =>{
    setErrorMessage(false)
    props.deleteToken()
    navigate('/')
  }

  const toProfile = ()=>{
    navigate('/profile')
  }

  /*const handleOffSureMessage = ()=>{ //set the id of the post to delete and boolean to present or not the sure message
    ctx.setVal('deletePost',[{'myPostIdToDelete':null,'state':false}])
  }*/
  
  /*const yesChooseToDelete = ()=>{ //Trigger the the delete and the get new data function on myPosts comp
    ctx.setVal('refreshMyPostData',true)
  } */

  if(ctx.val.deleteSearchWord === true)
  {
    inputRef.current.value = '' //Set the search input to empty string when returing to page
    ctx.setVal('deleteSearchWord',false)//Than return the state to the initial state
  }
    return(
        <div className='main'>
            
               <div className='mainNav'>
               <h2 onClick={()=>{navigate('allPosts')}}>Post-It</h2> 
               <div className='inputWrapper'>
                <input onChange={handleSearchPost} ref={inputRef} className='searchInput' type="text" placeholder='Search anything' />
               </div> 
               <Tooltip style={{marginLeft:'66rem',marginTop:'-6rem'}} title="Profile">
               <IconButton onClick={handleOpenUserMenu}  sx={{ p: 0 }}>
               <Avatar  alt={PF+'noAvatar.png'} src={PF+userData?.[0]?.Image}> 
               {!userData?.[0]?.Image&&userData?.[0]?.Name.slice(0,1)} 
               </Avatar>       
               </IconButton>
             </Tooltip>
             <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography onClick={toLogOut}  textAlign="center">{'Log Out'}</Typography>
                </MenuItem>
                 <MenuItem  onClick={handleCloseUserMenu}>
                 <Typography onClick={toProfile} textAlign="center">{'Profile'}</Typography>
               </MenuItem>
            </Menu>
           </div>  
           {!errorMessage&&<div className='secondaryNav'>
             <div className='settingsContainer'>
                     <span  className='settingBox' onClick={moveToAllPosts}>All posts</span>
                     <span  className='settingBox' onClick={moveToAddPost} >Add post</span>
                     <span  className='settingBox' onClick={moveToMyPosts}>My posts</span>
                   
             </div>
            </div> } 
            {/*ctx.val.deletePost[0].state&&<div className='suretodeletemessagewrapper'>
              {/*Sure to delete message - should move to the modal component} 
                    <div className='suretodeletemessage'>
                        <h2>Are you sure to delete</h2> <br />
                        <button className='sureBtn'  onClick={yesChooseToDelete}>Yes</button>&nbsp;<button className='sureBtn' onClick={handleOffSureMessage}>No</button>
                    </div>
            </div>*/}
              
           <Outlet/>
           <div className="footer">
            <h4>Finds us on</h4>
            <SocialIcon bgColor="white" style={{ height: 30, width: 30 }} url="https://instagram.com"/>&nbsp;
            <SocialIcon fgColor="white" style={{ height: 30, width: 30, marginLeft:'0.5rem' }} url="https://facebook.com"/>&nbsp;
            <SocialIcon fgColor="white" style={{ height: 30, width: 30,marginLeft:'0.5rem' }} url="https://whatsapp.com"/>
           </div>
           
        </div>
    )
} 
export default MainBlog
