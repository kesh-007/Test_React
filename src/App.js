import instagram from './instagram.jpg';
import './App.css';
import Post from './Post';
import { useEffect, useState } from 'react';
import ImageUpload from './ImageUpload';
import {auth, db} from "./firebase";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,signOut} from 'firebase/auth';




function App() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  const [posts, setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [username,setUsername] = useState('');
  const [user,setUser] = useState(null);
  const [openSignIn,setOpenSignIn] = useState(false);
  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      
      if (authUser)
      {
       // console.log(authUser);
        setUser(authUser);

        if (authUser.displayName)
        {

        }
        else
        {
          return (authUser.updateProfile({
            displayName: username
          }))
        }
      }else
      {
        setUser(null);
      }
    })
  
    return ()=>{
      
      unsubscribe();
    }
  },[user,username])

    useEffect(() => {
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
        setPosts(snapshot.docs.map(doc=>({
          id: doc.id,
          post:doc.data()
        })
        ));
      })

    },[])
    const  Signup=async (event)=>{
      event.preventDefault();
       try 
       {
         await createUserWithEmailAndPassword(auth,email,password);
        }
       catch(error) 
       {
         alert(error.message);
        }
       setOpen(false);
    }
    const SignIn=async (event)=>{
      event.preventDefault();
      try
      {
        await signInWithEmailAndPassword(auth,email,password);
      }
      catch(error)
      {
        alert(error.message);
      }
      setOpenSignIn(false);
    }
    
  return (
    <div className="App">
      
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          <center><img className='app_headerimage' src={instagram} alt='logo' /></center>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className='app_signup'>
          <Input
            placeholder='Username'
            type='text'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}/>

            <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
            placeholder='password'
            type='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>
            <Button type='submit' onClick={Signup}>Signup</Button>
            </form>

          </Typography>
        </Box>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          <center><img className='app_headerimage' src={instagram} alt='logo' /></center>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className='app_signup'>
          

            <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
            placeholder='password'
            type='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>
            <Button type='submit' onClick={SignIn}>Sign In</Button>
            </form>

          </Typography>
        </Box>
      </Modal>

       <div className="app_header">
        <img className='app_headerimage' src={instagram} alt='logo' />
        {user?(
        <Button onClick={()=>signOut(auth)}>Sign Out</Button>
      ):(
        <div className='app_logincontainer'>
        <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
      )

      }
     
      </div>

      <div className='app_posts'>
      {
       posts.map(({id,post}) => (
          <Post key={id} username={post.username} caption={post.caption} img={post.imageUrl}/>
   ))

       
      }
      </div>
       
       {user?.displayName?
      (
      <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry you need to Login to post </h3>
      )}
         
      <Button onClick={()=>setOpen(true)}>Sign Up</Button>
      
     
     
      
    </div>
  );
}

export default App;
