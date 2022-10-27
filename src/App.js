import './App.css';
import {Routes,Route} from 'react-router-dom'  
import Login from './components/entrance/login'
import MainBlog from './components/MainBlog/mainBlog';
import Addpost from './components/MainBlog/Addpost/addPost';
import AllPosts from './components/MainBlog/allPosts/allPosts';
import MyPosts from './components/MainBlog/Myposts/myPosts';
import SignUp from './components/entrance/signUp';
import Reset from './components/entrance/reset';
import {useState} from 'react'
import Context from './context/Context';
import SinglePost from './components/MainBlog/singlePost/singlePost';
import Profile from './components/Profile/profile';
import Singleuser from './components/MainBlog/singleUser/singleUser';
import Modal from './UI/Modal';

function App() {

   const [val, setVal] = useState({ //Context states to manage opperations
    errorState:false,
    searchWord:'',
    deleteSearchWord:false,
    deletePost:[{state:false,myPostIdToDelete:null}],
    refreshMyPostData:false,

  }); 

const showPopUp = (e)=>{//Shows to modal popUp 
  setVal({...val,['deletePost']:[{state:true,myPostIdToDelete:e}]})
}

const hidePopUp = ()=>{//Hide the modal popUp
  setVal({...val,['deletePost']:[{state:false,myPostIdToDelete:null}]})
}
   

const yesChooseToDelete = ()=>{ //Trigger the the delete and the get new data function on myPosts comp
  setVal({...val,['refreshMyPostData']:true})
} 

    
  return (
    <div className="App">
      <Context.Provider value={{val,setVal:(property,data)=>setVal({...val,[property]:data})}}>
          {val.deletePost?.[0]?.state&&<Modal
           onClose={hidePopUp}>
                    <div>
                        <h2>Are you sure to delete</h2> <br />
                        <button className='sureBtn' onClick={yesChooseToDelete}>Yes</button>&nbsp;<button className='sureBtn' onClick={hidePopUp}>No</button>
                    </div>
            </Modal>}
        <Routes> 
        <Route path='/' element={<Login/>}/>
            <Route path='signup' element={<SignUp/>}/>
            <Route path='reset' element={<Reset/>}/>
            <Route path='/profile' element={<Profile/>}/>
          <Route path='/main' element={<MainBlog />}> {/*all user data comes in the arrivedToken*/}
               <Route path='addPost' element={<Addpost/>}/>
               <Route path='allPosts' element={<AllPosts/>}/>
               <Route path='myPosts' element={<MyPosts onShow={showPopUp} />}/>
               <Route path='singlePost/:id' element={<SinglePost/>}/>
               <Route path='singleUser/:id' element={<Singleuser/>}/>
          </Route>
        </Routes>
        </Context.Provider>
        
         
    </div>
  );
}

export default App;
