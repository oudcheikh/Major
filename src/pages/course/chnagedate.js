import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db, functions } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { query, collection, addDoc, getDocs, getDoc, setDoc, deleteDoc, arrayUnion, arrayRemove, updateDoc, where, doc, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import advancedFormat from 'dayjs/plugin/advancedFormat';

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
dayjs.extend(advancedFormat);

export default function UpdateCourseDateTime(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const [valueDateTile, setValue] = React.useState(new Date(Props.props.date.toString()));

  const changeHour = httpsCallable(functions, 'adminChangeHoraire');


  const updateCours = async () => {

    //setIsDisabled(true);

    const mycourseKey = Props.props.course_uid ;
    const myclient_uid = Props.props.client_uid ;

   
   var track = false ; 



   function change_value(e) {
    return true;
}
    setOpen(false);
    
    changeHour({ courseKey: mycourseKey,  uid : myclient_uid, horaire :new Date(valueDateTile)})
    .then((result) => {
      // Read result of the Cloud Function.
      /** @type {any} */
      const data = result.data;
      track = change_value(track);
    }
    );
    

    
  const querySnapshotTrackProcess = collection(db, "Users",myclient_uid, "Courses", mycourseKey, "TrackProcess")
  const docReef = await addDoc(querySnapshotTrackProcess, 
    
    {

      by: user.email,
      date : new Date(),
      satus: "Change Date", 
  
    });


  const docRef = doc(db, "Users",myclient_uid, "Courses", mycourseKey);
  // updateDoc(docRef, {count_sent_notif : 1})

    setOpen(false)

    navigate("/waitingcourse",)
   
   
// setIsDisabled(false);

  };

//   const updateCours = async () => {

//     const current_cours = Props.coursToBeActivated;
//     const prof_uid = Props.props.client_uid ;
//     const profProfile = doc(db, "Users", prof_uid);
//     const profProfileSnap = await getDoc(profProfile);

//     if (profProfileSnap.exists()) {
//       console.log("``");
//     } else {
//       console.log("``");
//     }
    
//     const docRef = doc(db, "Users", prof_uid, "Courses", Props.props.course_uid)

//     // const docRef = await updateDoc(querySnapshotCourses, {
//     //   statut: -4
//     // });

//     await updateDoc(docRef, {
    
//         date : valueDateTile.toDate() ,
//       statut_date : new Date()
//    });


//    // Props.setdatecours(valueDateTile.toDate())

//    // await deleteDoc(doc(db, "In_Process", Props.props.course_uid));

   
//    const docinInProcess = doc(db, "In_Process",  Props.props.course_uid);
//    const docinInProcessSnap = await getDoc(docinInProcess);

//    if (docinInProcessSnap.exists()) {

//     await updateDoc(docinInProcess, {
    
//       course_date : valueDateTile.toDate() ,
  
//  });
//   } else {
//   }


//   const querySnapshotTrackProcess = collection(db, "Users",prof_uid, "Courses", Props.props.course_uid, "TrackProcess")

//   const docReef = await addDoc(querySnapshotTrackProcess, 
    
//     {

//       by: user.email,
//       old_date : Props.props.date,
//       date : new Date(),
//       satus: "change_date", 
//       remarque : " ", 
//     });


//     navigate("/waitingcourse",)


//    setOpen(false)

//   };

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
              const dateWithSecondsZero = dayjs(newValue).set('second', 0);
              setValue(dateWithSecondsZero);
            }}
          />
        </LocalizationProvider>
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
