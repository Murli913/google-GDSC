import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import {  auth, db, storage } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useReactMediaRecorder } from "react-media-recorder";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
const userData = [
  { name: "Child abuse" },
  { name: "Human Traffing" },
  { name: "Sexual harassment" },
  { name: "Women sexual assault" },
  { name: "Child migration" }
];



function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [users, setUsers] = useState([]);
  const [imageUpload,setImageUpload]=useState(null);
  
  //start location
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
});

const onSuccess = (location) => {
    setLocation({
        loaded: true,
        coordinates: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        },
    });
};

const onError = (error) => {
    setLocation({
        loaded: true,
        error: {
            code: error.code,
            message: error.message,
        },
    });
};

useEffect(() => {
    if (!("geolocation" in navigator)) {
        onError({
            code: 0,
            message: "Geolocation not supported",
        });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}, []);
//end location
 

  const uploadImage =() => {
    if(imageUpload == null)return ;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef,imageUpload).then(() => {
      alert("image uploaded");
    })

  };


  useEffect(() => {
    setUsers(userData);
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = users.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      let tempUser = users.map((user) =>
        user.name === name ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
    }
  };



  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createPost = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      users,
      location,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
    navigate("/");
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
  useReactMediaRecorder({ video: true });

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Complaint</h1>
        <div className="inputGp">
          <label> Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>

        <div className="inputGp">
          <label> Which type of complaint it is...</label>
          <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="allSelect"
            checked={!users.some((user) => user?.isChecked !== true)}
            onChange={handleChange}
          />
          <label >All Select</label>
          </div>
          {users.map((user, index) => (
          <div className="form-check" key={index}>
            <input
              type="checkbox"
              className="form-check-input"
              name={user.name}
              checked={user?.isChecked || false}
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">{user.name}</label>
          </div>
        ))}
        </div>


        <div className="inputGp">
        <label htmlFor='profile-photo'>Select Photo from Gallery </label>
        <input type="file" 
      onChange={(event)=>{
        setImageUpload(event.target.files[0]);
      }}/>

      <button onClick={uploadImage}>Upload file</button>
            
        </div>


        <div className="inputGp">
       <p>Status: {status}</p>
       <button onClick={startRecording}>Start Recording</button>
          <video src={mediaBlobUrl} controls  loop />
          <button onClick={stopRecording}>Stop Recording</button>
        </div>














        <button onClick={createPost}> Submit Complaints</button>
      </div>
    </div>
  );
}

export default CreatePost;