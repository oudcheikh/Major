import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "./../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, addDoc, getDocs, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, where, doc, onSnapshot } from "firebase/firestore";


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
  const updateCours = async () => {


    
    
    // il faut mettre a jour le vours prof 
    // Props.state.row.lastname
    //

//     const current_cours = Props.coursToBeActivated;
//     const prof_uid = Props.props;
//     const profProfile = doc(db, "Users", prof_uid);
//     const profProfileSnap = await getDoc(profProfile);

//     if (profProfileSnap.exists()) {
//       console.log("``");
//     } else {
//       console.log("``");
//     } 
//     const querySnapshotCredit = collection(db, "Users", prof_uid, "Credit")

//     const docRef = await addDoc(querySnapshotCredit, {
//       added_value: Props.credit_value,
//       by: "admin",
//       old_credit: profProfileSnap.data().credit,
//       created_at : new Date(),
//       operation : "old_credit : " + profProfileSnap.data().credit + "  udpate_value : " + Props.credit_value, 
//     });
//     await updateDoc(profProfile, {
//       credit: parseInt(profProfileSnap.data().credit) + parseInt(Props.credit_value)
//    });

   setOpen(false)

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
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
