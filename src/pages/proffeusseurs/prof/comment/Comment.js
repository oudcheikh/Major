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
import TextField from '@mui/material/TextField';

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
  const formRef = React.useRef();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [value, setValue] = React.useState('Crédit de recharge contre argent du Professeur');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [textInput, setTextInput] = React.useState('');

  const handleTextInputChange = event => {
      setTextInput(event.target.value);
  };



  const updateCours = async () => {



    setIsDisabled(true)
    
    const prof_uid = Props.prof;
    const profProfile = doc(db, "Users", prof_uid);
    const profProfileSnap = await getDoc(profProfile);

    

    if (profProfileSnap.exists()) {
      console.log("``");
    } else {
      console.log("``");
    }


    console.log("textInput : ", textInput)
    
    const querySnapshotCredit = collection(db, "Users", prof_uid, "Comments")
    

    const docRef = await addDoc(querySnapshotCredit, 
      
      {
      by: "Admin",
      email : user.email,
      created_at : new Date(),
      comment : textInput
    }
    );


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
      <Button onClick={handleOpen}>Ajouter un commentaire</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off">
      <TextField
          id="filled-multiline-static"
          label="Commentaire"
          multiline
          rows={7}
          defaultValue=" "
          onChange= {handleTextInputChange}
          style = {{width: 400}}
        />
      
    </Box>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>

        </Typography>
       
        <Grid> <Button onClick={updateCours} disabled={isDisabled}>Ajouter</Button></Grid> 
        </Box>
         
       
      </Modal>
    </div>
  );
}
