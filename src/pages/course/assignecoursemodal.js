import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db, functions } from "./../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, addDoc, getDocs, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, where, doc, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

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

export default function AssignCourseModal(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [isDisabled, setIsDisabled] = React.useState(false);
  const navigate = useNavigate();

  const adminAttributeCourse = httpsCallable(functions, 'adminAttributeCourse');

  
  const updateCours = async () => {

    setIsDisabled(true)
  adminAttributeCourse({
    
  "courseKey" : Props.course.data.course_uid,  
  "clientUid" :  Props.course.data.client_uid,
  "profUid" : Props.state.value

})
     .then((result) => {
       // Read result of the Cloud Function.
       /** @type {any} */
       const data = result.data;
       const sanitizedMessage = data.text;
       

       if (data.success) {
        setOpen(false);

        navigate("/waitingcourse");
        

       }

       else {
        setOpen(false);
       }

  //     const profList = data.profList;
     });
    
  
  

  };

  return (
    <div>
      <Button onClick={handleOpen}>Assign course</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez assigner le course ({Props.course.course}) 
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           a  {Props.state.row.firstname}   {Props.state.row.lastname}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          </Typography>
          <Button onClick={updateCours} disabled={isDisabled}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
