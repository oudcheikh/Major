import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddModal from "./addenfentmodal"
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Autocomplete from '@mui/material/Autocomplete';
import { Grid } from '@mui/material';



export default function AjouterEnfent() {
  
  
  const [user, loading, error] = useAuthState(auth);

  const [nom, setnom] = React.useState('');
  const [prenom, setprenom] = React.useState('');

  const [school, setschool] = React.useState('');
  const [serie, setserie] = React.useState('');
  const [classroom, setClassroom] = React.useState([]);
  const [selectedClasrom, setselectedClasrom] = React.useState('');


  const { state } = useLocation();
  const navigate = useNavigate();
  let [isDisabled, setIsDisabled] = React.useState(false);


  const handlenom = event => {
    setnom(event.target.value);
};

const handleprenom = event => {
  setprenom(event.target.value);
};

const handlesecole = event => {
  setschool(event.target.value);
};

  function selectSelectedClassroom(event, value) {
    
    setselectedClasrom(value) 
    
 
  }
  function handleInputChangeSerie(event, value) {
    setserie(value);
   
  }



  const fetchAllClient = async () => {

    const docRef = doc(db, 'Classroom', 'français'); // Remplacez 'collectionName' et 'documentId' par vos valeurs
  
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
  
      setClassroom(docSnap.data().classroom)
  
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

 

  const updateCours = async () => {

    

    setIsDisabled(true)

 


    const newChildren = collection(db, "Users", state.uid, "Children")
    const docRef = await addDoc(newChildren, 
      {

        classroom:selectedClasrom,
        firstname:prenom.trimStart(),
        lastname:nom.trimStart(),
        school:school.trimStart() ,
        serie:serie.trimStart(),
        birthdate : new Date('01/01/2000'),
        from: "website"

      }
    )

    const phone = ""
   const data = ""
   const uid = state.uid
   
   navigate("/user/profile/parent",
   {
     state: { uid },
   });

   setIsDisabled(false);



  };
  return (

<div>
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
      Ajouter un enfent
    </Box>
    
    <br></br>
        
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        <Grid xs={12}>  
      
      <TextField
      label="nom"
        defaultValue=" "
        onChange= {handlenom}
        inputProps={{ maxLength: 64 }}
        style = {{width: 300}}
        />
        </Grid>
        </Box>
        <br></br>
        <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        <Grid xs={12}>  
      <TextField
          label="prenom"
          
          defaultValue=" "
          onChange= {handleprenom}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
          
        />
        </Grid>
        </Box>
        <br></br>
        <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        <Grid xs={12}>  
      <TextField
          label="school"
          defaultValue=" "
          onChange= {handlesecole}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
          
        />
        </Grid>
        </Box>
        <br></br>

   

    
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
          options={classroom}
          onInputChange={selectSelectedClassroom}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="classroom" 
          />}/>
        </Grid>
    </Box>



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
   
    <Grid xs={6}> <Button onClick={updateCours} disabled={isDisabled}>Add</Button>
    </Grid> 
    </Box>
    
    </div>
  );
}
