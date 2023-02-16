import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../../../firebase";
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

export default function CreditModal(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const updateCours = async () => {

    
    const current_cours = Props.coursToBeActivated;
    const prof_uid = Props.props;
    const profProfile = doc(db, "Users", prof_uid);
    const profProfileSnap = await getDoc(profProfile);

    if (profProfileSnap.exists()) {
      console.log("``");
    } else {
      console.log("``");
    }
    
    const querySnapshotCredit = collection(db, "Users", prof_uid, "Credit")

    const docRef = await addDoc(querySnapshotCredit, {
      added_value: Props.credit_value,
      by: "Admin",
      email : user.email,
      old_credit: profProfileSnap.data().credit,
      created_at : new Date(),
      operation : "old_credit : " + profProfileSnap.data().credit + "  udpate_value : " + Props.credit_value, 
    });

    await updateDoc(profProfile, {
      credit: parseInt(profProfileSnap.data().credit) + parseInt(Props.credit_value)
   });

   setOpen(false)
   const phone = ""
   const data = ""
   const uid = prof_uid
   navigate("/profProfile",
   {
     state: { phone, data, uid },
   });

  };

  return (
    <div>
      <Button onClick={handleOpen}>Update credit</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez augmenter le credit du prof de  {Props.credit_value} MRU
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

          </Typography>
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
