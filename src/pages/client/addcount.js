import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  '@media (max-width: 600px)': {
    width: '80%',
  },
  '@media (min-width: 601px) and (max-width: 960px)': {
    width: '60%',
  },
  '@media (min-width: 961px) and (max-width: 1280px)': {
    width: '50%',
  },
  '@media (min-width: 1281px)': {
    width: 400,
  },
};

dayjs.extend(advancedFormat);


export default function AddCount() {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [nclient, setnclient] = React.useState('');
  const [nom, setnom] = React.useState('');
  const [prenom, setprenom] = React.useState('');
  const [ville, setville] = React.useState('');
  const [quartier, setquartier] = React.useState('');
  const [adresse, setadresse] = React.useState('');
  const [school, setschool] = React.useState('');
  const [allvilles, setallvilles] = React.useState({});
  const [allselectedquartier, setallselectedquartier] = React.useState({});
  const [selectedClasrom, setselectedClasrom] = React.useState('');
  const [typeclient, settypeclient] = React.useState('parent');
  const [classeroom, setclasseroom] = React.useState([]);
  const [serie, setserie] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  let [isDisabled, setIsDisabled] = React.useState(false);
 


  function selectTypeClinet(event, value) {
   
    settypeclient(value);
    
  }


  function selectSelectedClassroom(event, value) {
    
    setselectedClasrom(value) 
    
 
  }

  function handleInputChangeSerie(event, value) {
    setserie(value);
   
  }
  
  const handlenclient = event => {
    setnclient(event.target.value);
};


const handlenom = event => {
    setnom(event.target.value);
};

const handleprenom = event => {
  setprenom(event.target.value);
};


const handlesecole = event => {
  setschool(event.target.value);
};

function handleville(event, value) {
 
  setville(value);
  // Object.keys(allvilles).filter(key => key ===event.target.value)
  setallselectedquartier(Object.keys(allvilles[value]))

 
  
};

function handlequartier(event, value) {


  setquartier(value);
};


const handleadresse = event =>{
  setadresse(event.target.value);
};

  const fetchAllClient = async () => {

  const docRef = doc(db, 'Classroom', 'français'); // Remplacez 'collectionName' et 'documentId' par vos valeurs

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {

    setclasseroom(docSnap.data().classroom)

  } else {
    // doc.data() sera 'undefined' dans ce cas
    console.log("No such document!");
  }


  const docRefLocation = doc(db, 'Location', 'position'); // Remplacez 'collectionName' et 'documentId' par vos valeurs

  const docSnapLocation = await getDoc(docRefLocation);

  if (docSnapLocation.exists()) {
    setallvilles(docSnapLocation.data())

  } else {
    // doc.data() sera 'undefined' dans ce cas
    console.log("No such document!");
  }
    
  };

  React.useEffect(() => {

  
    if (loading) return;
    if (!user) return navigate("/");

    fetchAllClient();
  }, []);

  const closeModal = async () => {
    setOpen(false)
  }

  function estUnNumeroDeHuitChiffres(num) {
    return num >= 10000000 && num < 100000000;
  }
  const regex = /^\d{8}$/;

  const updateCours = async () => {



    setIsDisabled(true)

    if (!estUnNumeroDeHuitChiffres(nclient)) {
      window.alert("Mettez bien le numero du client ");
      setIsDisabled(false)
      return;
    }

    let userdata 

    if (typeclient == 'parent'){
      userdata = {
     
    adress : adresse,
    avatar :"",
    city : ville,
    firstname : prenom.trimStart(),
    isBlocked : false,
    kyc : false,
    language :"",
    lastname : nom.trimStart(),
    location : allvilles[ville][quartier],
    phone :  "+222" + String(nclient),
    quartier : quartier,
    subscription_date : new Date(),
    userType : 1,
    createdBy : user.email,
    from: "website"

   
      }
    }

    if (typeclient == 'éleve'){
      userdata = {
     
    adress : adresse,
    avatar :"",
    city : ville,
    firstname : prenom.trimStart(),
    isBlocked : false,
    kyc : false,
    language :"",
    lastname : nom.trimStart(),
    location : allvilles[ville][quartier],
    phone :  "+222" + String(nclient),
    quartier : quartier,
    subscription_date : new Date(),
    userType : 3,
    school : school,
    classroom:selectedClasrom,
    serie:serie,
    createdBy : user.email,
    from: "website"
      }
    }
    const newuser = collection(db, "Users")
    const docRef = await addDoc(newuser,userdata)


    navigate("/");

   setIsDisabled(false);



  };

  return (
    <div> 
      <Button onClick={handleOpen}>Ajouter un compte</Button>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
          }}>
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
    </Box>
 
   
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        </Typography>
        <div> 
        
        <Grid xs={6}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={["parent", "éleve"]}
          onInputChange={selectTypeClinet}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="type client" 
          />}/>
        </Grid>
        </div>
        <Grid xs={12}>
        </Grid>
        <br></br>
<Grid xs={12}>  
<TextField
      label="Numéro_client"
          type="number"
          defaultValue=" "
          onChange= {handlenclient}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
          required
        />
        
        </Grid>
        <br></br>
        <Grid xs={12}>  
      
      <TextField
      label="nom"
        defaultValue=" "
        onChange= {handlenom}
        inputProps={{ maxLength: 64 }}
        style = {{width: 300}}
        />
        </Grid>
        <br></br>
        <Grid xs={12}>  
      <TextField
          label="prenom"
          
          defaultValue=" "
          onChange= {handleprenom}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
          
        />
        </Grid>
        <br></br>
        
        <Grid container spacing={2}>
  <Grid item xs={6}>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Object.keys(allvilles)}
      onInputChange={handleville}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="ville" />}
    />
  </Grid>
  <Grid item xs={6}>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={allselectedquartier}
      onInputChange={handlequartier}
      sx={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="quartier" />}
    />
  </Grid>
</Grid>

        <br></br>
        <Grid xs={12}>  
      <TextField
      label="adresse"
          rows={1}
          defaultValue=" "
          onChange= {handleadresse}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
        />
        
        </Grid>

        <br></br>
        {typeclient == 'éleve' &&
        <Grid xs={12}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={classeroom}
          onInputChange={selectSelectedClassroom}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="classroom" 
          />}/>
        </Grid> }
        <br></br>
  {selectedClasrom.includes("Lycée") &&
   <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    > 
    <Grid xs={12}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={[{serie: "C"}, {serie: "D"}, {serie: "A"}, {serie: "O"},{serie: " "}].map((option) => option.serie)}
          onInputChange={handleInputChangeSerie}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="serie" 
          />}/>
        </Grid></Box>}
        <br></br>

        {typeclient == 'éleve' &&
         <Grid xs={12}>  
         <TextField
             label="school"
             defaultValue=" "
             onChange= {handlesecole}
             inputProps={{ maxLength: 30 }}
             style = {{width: 150}}
             
           />
           
           </Grid> }

        <Grid xs={6}> 
        <Button onClick={updateCours} disabled={isDisabled}>Add</Button>
        <Button onClick={closeModal} disabled={isDisabled}>close</Button>
        </Grid>
        <Grid xs={6}>    
        </Grid> 

        </Box>
         
      </Modal>
      </Box>
    </div>
  );
}
