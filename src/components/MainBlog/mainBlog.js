import './mainBlog.css'
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import {useState,useContext, useEffect} from 'react'
import Context from '../../context/Context';
import {useNavigate,Outlet} from 'react-router-dom'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';



const MainBlog = (props) =>{

  const navigate = useNavigate()  
  const ctx = useContext(Context) //Context
  const [errorMessage,setErrorMessage]=useState(false)
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [tokenData,setTokenData]=useState(null)

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
 
 
  useEffect(()=>{
     const session = JSON.parse(localStorage.getItem('tokenData'))
     setTokenData(session)
   
  },[])
  useEffect(()=>{
    if(ctx.val === true)
    {
       setErrorMessage(true)
       console.log('Cant load page')//The error present when there is no access tokens
    }
  },[ctx])

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
  
 
    return(
        <div className='main'>
            {errorMessage?<div className='errormessage'>
                          <h1>Cant load page!</h1> <br />
                          <button className='errorBtn' onClick={(e)=>navigate('/')}>return to login page</button>
             </div>:
             <div>
               <div className='mainNav'>
               <h2>Post-It</h2> 
               <div className='inputWrapper'>
                <input className='searchInput' type="text" placeholder='Search anything' />
               </div> 
               <Tooltip style={{marginLeft:'66rem',marginTop:'-6rem'}} title="Profile">
               <IconButton onClick={handleOpenUserMenu}  sx={{ p: 0 }}>
                 <Avatar alt={tokenData?.Data?.Name} src={"/static/images/avatar/2.jpg" }/>          
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
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography onClick={toLogOut} textAlign="center">{'Log Out'}</Typography>
                </MenuItem>
                 <MenuItem  onClick={handleCloseUserMenu}>
                 <Typography onClick={toProfile} textAlign="center">{'Profile'}</Typography>
               </MenuItem>
            </Menu>
           </div>  
           <div className='secondaryNav'>
             <div className='settingsContainer'>
                     <span  className='settingBox' onClick={moveToAllPosts}>All posts</span>
                     <span  className='settingBox' onClick={moveToAddPost} >Add post</span>
                     <span  className='settingBox' onClick={moveToMyPosts}>My posts</span>
                     <span  className='settingBox'>4</span>
             </div>
            </div> 
              
           <Outlet/>
           </div> }
        </div>
    )
} 
export default MainBlog
