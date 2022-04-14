import {Input ,Button ,LinearProgress} from '@mui/material';
import firebase from 'firebase/compat/app';
import {db,storage} from './firebase';
import { useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import './imageupload.css'


function ImageUpload({username}) 
{
const [caption,setcaption]=useState('');
const [image,setimage]=useState(null);
const [progress,setprogress]=useState(0);
const handleChange = (e) => {
    if (e.target.files[0]) {
      setimage(e.target.files[0]);
    }
  }
  const handleUpload = () => {
    const StorageRef=ref(storage,`images/${image.name}`)
    const uploadTask=uploadBytesResumable(StorageRef,image)
    uploadTask.on(
      'state_changed',
    (snapshot)=>{
      const progress=Math.round(
        (snapshot.bytesTransferred/snapshot.totalBytes)*100);
        setprogress(progress)
        },
        (error)=>{
          console.log(error);
          alert(error.message);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then(url=>{
            db.collection('posts').add({
              timestamp:firebase.firestore
              .Timestamp.now().toDate(),
              caption:caption,
              imageUrl:url,
              username:username
            })
            setprogress(0);
            setcaption("");
            setimage(null);
          } 
          
          )
        }
 )} 
return (
  <div className='image_upload'>
    <div className='image_upload_container'>
    <LinearProgress   variant="determinate" value={progress} color="inherit" />
    </div>
      <Input
          placeholder='Caption'
          type='text'
          value={caption}
          onChange={(e)=>setcaption(e.target.value)}/>

      <input type="file" onChange={handleChange}/>
      <Button onClick={handleUpload}>Upload</Button>
      
</div>

)
}
export default ImageUpload