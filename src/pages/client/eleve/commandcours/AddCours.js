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
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';


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

function getPriceByCourse(courses, course) {
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].course === course) {
      return courses[i].priceSA ;
    }
  }
  return null;
}




export default function AddCours(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [offre, setoffre] = React.useState([]);
  const [nclient, setnclient] = React.useState('');
  const [price, setprice] = React.useState('');
  const [cours, setcours] = React.useState();
  const [valueDateTile, setValue] = React.useState(new Date());
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const formRef = React.useRef();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [valuen, setValuen] = React.useState(1);

  const handleChange = (event) => {
    setValuen(event.target.value);
  };

  function handleInputChange(event, value) {
    setcours(value);
   setprice(getPriceByCourse(offre, value)[profile.classroom.split(" ")[1]])
  }

  const [textInput, setTextInput] = React.useState('');

  const handleTextInputChange = event => {
      setTextInput(event.target.value);
  };


  const handleTextInputChangenclient = event => {
    setnclient(event.target.value);
};

  const fetchAllClient = async () => {



    const client_uid = Props.client;
    const clientProfile = doc(db, "Users", client_uid);
    const clientProfileSnap = await getDoc(clientProfile);

    const AllCourses = doc(db, "Courses", "français");
    const offercours = await getDoc(AllCourses);

    
  
    if (clientProfileSnap.exists()) {
      setProfile(clientProfileSnap.data());
      let classroom = clientProfileSnap.data().classroom.split(" ");
    } else {
      console.log("``");
    }


    if (offercours.exists()) {
    } else {
      console.log("``");
    }

    let classroom = clientProfileSnap.data().classroom.split(" ");    

    setoffre(offercours.data()[classroom[0]].filter(element => element.actif === true))
  

  };

  React.useEffect(() => {

  
    if (loading) return;
    if (!user) return navigate("/");

    fetchAllClient();
  }, []);

  const updateCours = async () => {



    setIsDisabled(true)
    
    const client_uid = Props.client;
    const clientProfile = doc(db, "Users", client_uid);
    const clientProfileSnap = await getDoc(clientProfile);

    const AllCourses = doc(db, "Courses", "français");
    const offercours = await getDoc(AllCourses);


    

    const prix = valuen * getPriceByCourse(offre, cours)[profile.classroom.split(" ")[1]];
    // offre.filter(element => element.cours === cours)

    const querySnapshotCredit = collection(db, "Users", client_uid, "Courses")
    
    const docRef = await addDoc(querySnapshotCredit, 
      {
        booking_date : new Date(),
        classroom : profile.classroom,
        client_uid : client_uid,
        course : cours,
        date : valueDateTile.toDate(),
        duration : valuen,
        noted : false,
        price : prix ,
        prof : ""  ,
        prof_number : "",
        prof_uid :"",
        serie : profile.classroom.split(" ")[1],
        statut : 0,
        statut_date : new Date(),
        subject : textInput,
        num_client : nclient,
        userType : 3 ,
        by: user.email,
        from: "website"
    }

    )
    ;
    


   setOpen(false)

   const phone = ""
   const data = ""
   const uid = client_uid
   
   navigate("/user/profile/student",
   {
     state: { uid },
   });

   setIsDisabled(false);
   

  };

  return (
    <div>
      <Button onClick={handleOpen}>Ajouter un cours</Button>
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
        <Grid>
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={offre.map((option) => option.course)}
      onInputChange={handleInputChange}

      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="course" 
      
      
      />}
    />
        </Grid>
       
        <br></br>
        <Grid>
          Prix (1h) : {price}
        </Grid>
        <br></br>
        <Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="DateTimePicker"
            value={valueDateTile}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </LocalizationProvider>
        </Grid>
        <br></br>

        
         <Grid> 
         <div>
      
         <FormControl>
      
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={valuen}
        onChange={handleChange}
      >
        <FormControlLabel value = "1" control={<Radio />} label="1h" />
        <FormControlLabel value="2" control={<Radio />} label="2h" />
        <FormControlLabel value="3" control={<Radio />} label="3h" />
        <FormControlLabel value="4" control={<Radio />} label="4h" />
      </RadioGroup>
    </FormControl>
    </div>
       </Grid> 
       <br>
        </br>

        <Grid><TextField
          
          label="sujet"
          multiline
          rows={1}
          defaultValue=" "
          onChange= {handleTextInputChange}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
        /></Grid>

        <br>
        </br>


<Grid>  <TextField
          
          label="Numéro_client"
          multiline
          rows={1}
          defaultValue=" "
          onChange= {handleTextInputChangenclient}
          inputProps={{ maxLength: 64 }}
          style = {{width: 300}}
        /></Grid>
        
      
        <Grid> <Button onClick={updateCours} disabled={isDisabled}>Ajouter</Button></Grid> 
        </Box>
         
       
      </Modal>
    </div>
  );
}
