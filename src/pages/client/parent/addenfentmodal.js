import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../../firebase";
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

export default function AddModal(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addChildren = async () => {

    
    const current_cours = Props.coursToBeActivated;
    const prof_uid = Props.props;
    const profProfile = doc(db, "Users", prof_uid);
    const profProfileSnap = await getDoc(profProfile);


   
    if (profProfileSnap.exists()) {
      console.log("..");
    } else {
      console.log("``");
    }
    


   

  //   await updateDoc(profProfile, {
  //     credit: parseInt(profProfileSnap.data().credit) + parseInt(Props.credit_value)
  //  });

   setOpen(false)

  };

  return (
    <div>
      <Button onClick={handleOpen}>Aajouter un enfent</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez augmenter le credit du prof de  {Props.classroom} MRU
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

          </Typography>
          <Button onClick={addChildren}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
