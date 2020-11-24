import './App.css';
import React, { useEffect, useState } from "react";
import logo from './logo.jpeg';
// import reactImg from "./logo_react.png";
import Post from './Post';
import { db, auth } from "./firebase";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload"
// import firebase from "firebase"
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 350,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle());

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  // If user starts the web-app again then he will not logged out
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User logged in...
        // console.log(authUser);
        // if (authUser.displayName) {
        // not to update name

        // }
        // else {
        // if a new user is created 
        // return authUser.updateProfile({
        //   displayName: username
        // })
        // }
        setUser(authUser);
      }
      else {
        // user has logged out...
        setUser(null);
      }
    })
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every single time a new post is added , this code fires...
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          posts: doc.data()
        }
      )
      ));
    })
  }, [])
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  }
  // console.log(user);
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err));
    setOpenSignIn(false);
  }
  // let date = new Date();
  // let hour = date.getHours();
  // let min = date.getMinutes();
  // let month = date.getMonth();
  // date = date.getDate();
  // const time = date + ' ' + hour + ' ' + min + ' ' + month
  // console.log(time);
  return (


    <div className="app">

      <div className="app_header">
        <img
          src={logo}
          className="app_headerImage"
          alt=""
        />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className={classes.paper} style={modalStyle}>
            <form className="app__signup">
              <center>
                <img
                  src={logo}
                  className="app_headerImage"
                  alt=""
                /></center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
            {/* </center> */}
          </div>
        </Modal>
        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
        >
          <div className={classes.paper} style={modalStyle}>
            <form className="app__signup">
              <center>
                <img
                  src={logo}
                  className="app_headerImage"
                  alt=""
                />
              </center>
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
            {/* </center> */}
          </div>
        </Modal>
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="login__container">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
          )}
      </div>
      {/* <Post username="Ritik" imgURL={reactImg} caption="Wonderful its perfectly working" />
      <Post username="Rahat" imgURL={logo} caption="Wonderful logo" />
      <Post username="Ritik" caption="Wonderful its perfectly working" /> */}
      <div className="app__post">
        {
          posts.map(({ id, posts }) => (
            < Post key={id} username={posts.username} caption={posts.caption} imageURL={posts.imageURL} />
          ))
        }
      </div>
      {/* <InstagramEmbed
        url='https://www.instagram.com/p/B_uf9dmAGPw/'
        // clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => { }}
        onSuccess={() => { }}
        onAfterRender={() => { }}
        onFailure={() => { }}
      /> */}
      <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => { }}
        onSuccess={() => { }}
        onAfterRender={() => { }}
        onFailure={() => { }}
      />
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Sorry u need to login to Upload</h3>
        )}
    </div>
  );
}

export default App;
