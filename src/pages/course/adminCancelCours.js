import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db ,functions} from "../../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { query, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc, arrayUnion, arrayRemove, updateDoc, where, doc, onSnapshot } from "firebase/firestore";


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

export default function CancelCours(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [valueDateTile, setValue] = React.useState(new Date());

  const cancelCours = httpsCallable(functions, 'adminCancelCourse');

  const updateCours = async () => {

    setIsDisabled(true);

    const mycourseKey = Props.props.course_uid ;
    const myclient_uid = Props.props.client_uid ;

    
   
    let track = false;
    setOpen(false);
    
    cancelCours({ courseKey: mycourseKey,  uid : myclient_uid})
    .then((result) => {
      // Read result of the Cloud Function.
     
      /** @type {any} */
      const data = result.data;
      setOpen(false)

      track = true ;
      
     
    }
   
    
    );
    
     
  const querySnapshotTrackProcess = collection(db, "Users",myclient_uid, "Courses", Props.props.course_uid, "TrackProcess")
  const docReef = await addDoc(querySnapshotTrackProcess, 
    
    {
      by: user.email,
      date : new Date(),
      satus: "Cancel Cours",
    });

    navigate("/")
  
//    navigate("/waitingcourse",)
//    setOpen(false)

  };

  useEffect(() => {
    
    setValue(Props.props.date);

    ;
   
  }, []);

  return (
    <div>
      <Button sx={{ 
      color: 'yellow', 
      backgroundColor: 'red',
      borderColor: 'green' }} onClick={handleOpen}>Annuler ce Cours</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Etes vous sur de vouloir annuler ce cours ?
          </Typography>
          <Button onClick={updateCours} disabled={isDisabled} >Oui</Button>
        </Box>
      </Modal>
    </div>
  );
}
