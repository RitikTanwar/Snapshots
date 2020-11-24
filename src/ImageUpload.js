import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshots) => {
                // progresss function
                const progress = Math.round((snapshots.bytesTransferred / snapshots.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => alert(error.message)
            , () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            username: username
                        })
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )

    }

    return (
        <div className="imageUpload">
            {/* // Caption input */}
            {/* // File picker */}
            {/* // Post buttons */}

            <progress value={progress} max="100" className="progressbar" />
            <input type="text" placeholder="Enter a caption..." onChange={(e => setCaption(e.target.value))} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>

        </div>
    )
}

export default ImageUpload
