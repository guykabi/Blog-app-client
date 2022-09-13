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
  const PF = 'http://localhost:8000/images/'
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
 
 
  useEffect(()=>{
     const session = JSON.parse(localStorage.getItem('tokenData'))
     setTokenData(session)
   
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

  const handleOffSureMessage = ()=>{ //set the id of the post to delete && boolean to present or not the sure message
    ctx.setVal('deletePost',[{'myPostIdToDelete':null,'state':false}])
  }
  
  const yesChooseToDelete = ()=>{ //Trigger the the delete and the get new data function on myPosts comp
    ctx.setVal('refreshMyPostData',true)
  }
 console.log(tokenData?.Data?.Image)
    return(
        <div className='main'>
            
               <div className='mainNav'>
               <h2 onClick={()=>{navigate('allPosts')}}>Post-It</h2> 
               <div className='inputWrapper'>
                <input onChange={handleSearchPost} className='searchInput' type="text" placeholder='Search anything' />
               </div> 
               <Tooltip style={{marginLeft:'66rem',marginTop:'-6rem'}} title="Profile">
               <IconButton onClick={handleOpenUserMenu}  sx={{ p: 0 }}>
               <Avatar style={tokenData?.Data?.Image?{background:`url(${PF+tokenData?.Data?.Image})`,backgroundSize:'cover',backgroundPosition:'center'}:{background:`url(${PF+'noAvatar.png'})`}} />         
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
           {!errorMessage&&<div className='secondaryNav'>
             <div className='settingsContainer'>
                     <span  className='settingBox' onClick={moveToAllPosts}>All posts</span>
                     <span  className='settingBox' onClick={moveToAddPost} >Add post</span>
                     <span  className='settingBox' onClick={moveToMyPosts}>My posts</span>
                     <span  className='settingBox'>4</span>
             </div>
            </div> } 
            {ctx.val.deletePost[0].state&&<div className='suretodeletemessagewrapper'>
              {/*Sure to delete message*/}
                    <div className='suretodeletemessage'>
                        <h2>Are you sure to delete</h2> <br />
                        <button className='sureBtn'  onClick={yesChooseToDelete}>Yes</button>&nbsp;<button className='sureBtn' onClick={handleOffSureMessage}>No</button>
                    </div>
         </div>}
              
           <Outlet/>
           <div className="footer">
            Footer
            </div>
           
        </div>
    )
} 
export default MainBlog
