import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
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

export default function AnnulCourse(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function updateProperty(db, prof_uid, course_uid, property, value) {
    try {
      const docRef = db.collection("Users").doc(prof_uid).collection("Courses").doc(course_uid);
      await docRef.update({
        [property]: value
      });
      console.log("Propriété mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la propriété: ", error);
    }
  }
  

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
      statut: -4,
      statut_date : new Date()
   });

   try {
    await deleteDoc(doc(db, "In_Process", Props.props.course_uid));
  }
  catch(err) {
    console.log("le document n'exite pas dabs la collection In_Progress ....")
  }

   

   setOpen(false)

  };

  return (
    <div>
      <Button sx={{ 
      color: 'yellow', 
      backgroundColor: 'green',
      borderColor: 'green' }} onClick={handleOpen}>Annuler</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez annuler le course de : 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

          </Typography>
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
