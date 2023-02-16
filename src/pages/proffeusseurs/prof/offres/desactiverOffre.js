import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs,getDoc,setDoc ,arrayUnion, arrayRemove,updateDoc, where, doc, onSnapshot } from "firebase/firestore";


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

export default function DesactiverModal(Props) {
  
  
  

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateCours = async () => {
   
   
    
   const current_cours = Props.coursToBeDesactivated;
   const prof_uid = Props.prof;

    const profProfile = doc(db, "Users",  prof_uid);
    const profProfileSnap = await getDoc(profProfile);
    const myprofile = profProfileSnap.data()
    
    const myActiveCourses = myprofile.courses
    const myDesactiveCourses = myprofile.coursesToValidate
    myDesactiveCourses.push(Props.coursToBeDesactivated)

    var filtered = myActiveCourses.filter(function(value, index, arr){ 
        return value != current_cours;
    });

   
    await updateDoc(profProfile, {
      courses: filtered,
      coursesToValidate: myDesactiveCourses, 
   });

    setOpen(false)

  };

 
  return (
    <div>
      <Button onClick={handleOpen}>Desactiver l'offre</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez desactiver l'offre  : {Props.coursToBeDesactivated}
          </Typography>
          <Typography id="modal-modal-title" variant="h4" component="h1">
            {Props.prof.coursToBeDesactivated}
          </Typography>
          
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
