import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db, functions } from "./../../firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, addDoc, getDocs, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, where, doc, onSnapshot } from "firebase/firestore";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { getFunctions, httpsCallable } from "firebase/functions";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Rendre la boîte plus petite sur mobile
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};





export default function SetPackagePrice(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [value, setValue] = React.useState('Crédit de recharge contre argent du Professeur');
  const [textInput, setTextInput] = React.useState('');
  
  const [checked, setChecked] = React.useState(true);
  const [ValueAug, setValueAug] = React.useState(0);
  const [selectedType, setselectedType] = React.useState("pas d'augmentation");

  const adminSetPackagePrice = httpsCallable(functions, 'adminSetPackagePrice');

  
  const updateCours = async () => {


    setIsDisabled(true)


    if (selectedType  === "augmentation distance avec pourcentage" && ValueAug > 50 )
    {
      // setOpen(false);
      return;
    }

    if (selectedType  === "augmentation distance sur le prix" && ValueAug > 200 )
    {
      // setOpen(false);
      return;
    }

    adminSetPackagePrice({

      "packageKey": Props.p_data.uid,
      "clientUid": Props.p_data.client_uid,
      "applyPacRed": checked,
      "increaseD":selectedType  === "pas d'augmentation" ? 0 : Number(ValueAug),
      "increaseDType": selectedType  === "pas d'augmentation" ? 0 : selectedType  === "augmentation distance avec pourcentage" ? 1 : 2,
      "email": user.email

    })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        const sanitizedMessage = data.text;
        if (data.success) {
          setOpen(false);
          navigate("/package");
        }
        else {
          setOpen(false);
        }
        //     const profList = data.profList;
      });


  };;

  function handleInputChangeType(event, value) {
   
    setselectedType(value);
  }

  const handlecheckedChange = (event) => {
    console.log("event.target.checked : ", event.target.checked
    )
    setChecked(event.target.checked);
  };

  const handleTextInputChange = event => {
    setTextInput(event.target.value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };




  return (
    <div>
      <Button onClick={handleOpen}>Set price</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Set Package Price
          </Typography>
          <Grid container spacing={2}>
            {/* Checkbox */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handlecheckedChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Applique la reduction"
              />
            </Grid>

            {/* Autocomplete */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={[
                  { "type": "pas d'augmentation", },
                  { "type": "augmentation distance avec pourcentage" },
                  { "type": "augmentation distance sur le prix" }
                ].map((option) => option.type)}

                onInputChange={handleInputChangeType}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
            </Grid>

            {/* Text Field */}

            {selectedType == "augmentation distance sur le prix" &&
              <Grid item xs={12}>
                <TextField
                  id="number-basic"
                  label={"En MRU : max 200"}

                  rows={1}
                  type="number"
                  inputProps={{ step: 1 }}
                  sx={{ width: 200 }}
                  onChange={(e) => setValueAug(e.target.value)}
                />
              </Grid>
            }

            {selectedType == "augmentation distance avec pourcentage" &&
              <Grid item xs={12}>
                <TextField
                  id="number-basic"
                  label={" en % : max 50 %"}

                  rows={1}
                  type="number"
                  inputProps={{ step: 1 }}
                  sx={{ width: 200 }}
                  onChange={(e) => setValueAug(e.target.value)}
                />
              </Grid>
            }

            {/* Button */}
            <Grid item xs={12}>
              <Button onClick={updateCours} disabled={isDisabled}>Valider</Button>
            </Grid>

          </Grid>
        </Box>
      </Modal>
    </div>
  );
}