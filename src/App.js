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

function App() {

   const [val, setVal] = useState({ //Context states to manage opperations
    errorState:false,
    searchWord:'',
    deletePost:[{state:false,myPostIdToDelete:null}],
    refreshMyPostData:false,
  });
   
    const Delete = () =>{
      localStorage.clear() //Clear the local storga eon users log out
    }

  return (
    <div className="App">
      <Context.Provider value={{val,setVal:(property,data)=>setVal({...val,[property]:data})}}>
        <Routes> 
        <Route path='/' element={<Login/>}/>
            <Route path='signup' element={<SignUp/>}/>
            <Route path='reset' element={<Reset/>}/>
            <Route path='/profile' element={<Profile/>}/>
          <Route path='/main' element={<MainBlog deleteToken={Delete} />}> {/*all user data comes in the arrivedToken*/}
               <Route path='addPost' element={<Addpost/>}/>
               <Route path='allPosts' element={<AllPosts/>}/>
               <Route path='myPosts' element={<MyPosts/>}/>
               <Route path='singlePost/:id' element={<SinglePost/>}/>
               <Route path='singleUser/:id' element={<Singleuser/>}/>
          </Route>
        </Routes>
        </Context.Provider>
        
         
    </div>
  );
}

export default App;
