import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
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

export default function UpdateCourseDateTime(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [valueDateTile, setValue] = React.useState(new Date());


  const updateCours = async () => {

    const current_cours = Props.coursToBeActivated;
    const prof_uid = Props.props.client_uid ;
    const profProfile = doc(db, "Users", prof_uid);
    const profProfileSnap = await getDoc(profProfile);

    if (profProfileSnap.exists()) {
      console.log("``");
    } else {
      console.log("``");
    }
    
    const docRef = doc(db, "Users", prof_uid, "Courses", Props.props.course_uid)

    // const docRef = await updateDoc(querySnapshotCourses, {
    //   statut: -4
    // });

    await updateDoc(docRef, {
    
        date : valueDateTile.toDate() ,
      statut_date : new Date()
   });

   // await deleteDoc(doc(db, "In_Process", Props.props.course_uid));

   
   const docinInProcess = doc(db, "In_Process",  Props.props.course_uid);
   const docinInProcessSnap = await getDoc(docinInProcess);

   if (docinInProcessSnap.exists()) {

    await updateDoc(docinInProcess, {
    
      course_date : valueDateTile.toDate() ,
  
 });
  } else {
  }


   setOpen(false)

  };

  useEffect(() => {
    
    setValue(Props.props.date);

    ;
   
  }, []);

  return (
    <div>
      <Button sx={{ 
      color: 'yellow', 
      backgroundColor: 'green',
      borderColor: 'green' }} onClick={handleOpen}>Changer la date</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="DateTimePicker"
            value={valueDateTile}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </LocalizationProvider>
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
