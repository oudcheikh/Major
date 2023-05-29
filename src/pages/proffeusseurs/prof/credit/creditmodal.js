import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, addDoc, getDocs, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, where, doc, onSnapshot } from "firebase/firestore";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Grid } from '@mui/material';

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



const raisontatus = (raison) => {

  if (raison == "Crédit de recharge contre argent du Professeur") {
    return 1;
  }
  if (raison == "Geste de bienvenue pour professeur")
  {
    return 2
  }
  if (raison == "Remboursement après promotion pour le client" )
  {
    return 3
  }
  if (raison == "Crédit donné par Major aux professeurs pour cadeau ou motivation")
  {
    return 4
  }
  if (raison == "Dédommagement exptionnel")
  {
    return 5
  }

  if (raison == "Retrait de frais pour cours assuré")
  {
    return 6
  }

  if (raison == "Récupération du crédit par le professeur")
  {
    return 7
  }
  else{
    return " "
  }
};

export default function CreditModal(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [value, setValue] = React.useState('Crédit de recharge contre argent du Professeur');

    const handleChange = (event) => {
      setValue(event.target.value);
    };



  const updateCours = async () => {

    setIsDisabled(true)
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
    

    const docRef = await addDoc(querySnapshotCredit, 
      
      {
      added_value: Props.credit_value,
      by: "Admin",
      email : user.email,
      old_credit: profProfileSnap.data().credit,
      created_at : new Date(),
      operation : "old_credit : " + profProfileSnap.data().credit + "  udpate_value : " + Props.credit_value, 
      raison : raisontatus(value),
    }
    );

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
          
        <Grid>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Pourquoi : </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel value="Crédit de recharge contre argent du Professeur" control={<Radio />} label="Crédit de recharge contre argent du Professeur" />
            <FormControlLabel value="Geste de bienvenue pour professeur" control={<Radio />} label="Geste de bienvenue pour professeur" />
            <FormControlLabel value="Remboursement après promotion pour le client" control={<Radio />} label="Remboursement après promotion pour le client" />
            <FormControlLabel value="Crédit donné par Major aux professeurs pour cadeau ou motivation" control={<Radio />} label="Crédit donné par Major aux professeurs pour cadeau ou motivation" />
            <FormControlLabel value="Dédommagement exptionnel" control={<Radio />} label="Dédommagement exptionnel" />
            <FormControlLabel value="Récupération du crédit par le professeur" control={<Radio />} label="Récupération du crédit par le professeur" />
            <FormControlLabel value="Retrait de frais pour cours assuré" control={<Radio />} label="Retrait de frais pour cours assuré" />
            
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>

          </Typography>
          </RadioGroup>
        </FormControl>
        </Grid>
        <Grid> <Button onClick={updateCours} disabled={isDisabled}>Valider</Button></Grid> 
        </Box>
         
       
      </Modal>
    </div>
  );
}
