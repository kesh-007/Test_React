import React from 'react';
import './Post.css';
import {Avatar} from '@mui/material';


function Post(props) {
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post_avatar'>{props.username[0]}</Avatar>
        <h3>{props.username} </h3>
      </div>
        <img className='post_image' src={props.img} alt="instagram" />
        <h4 className='post_text'><strong>{props.username}</strong> {props.caption}</h4>
    </div>
  )
}

export default Post