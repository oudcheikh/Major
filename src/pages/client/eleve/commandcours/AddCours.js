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

function filterActiveCourses(courses, niveau) {
  const activeCourses = [];
  for (const category in courses) {
    for (const course of courses[category]) {
      if (course.actif === true) {
        activeCourses.push(course);
      }
    }
  }
  return activeCourses;
}

function filterObjects(obj) {
  return obj.filter(function(item) {
    return item.valeur === "Lycée";
  });
}



export default function AddCours(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [offre, setoffre] = React.useState([]);
  const [valueDateTile, setValue] = React.useState(new Date());
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const formRef = React.useRef();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [textInput, setTextInput] = React.useState('');

  const handleTextInputChange = event => {
      setTextInput(event.target.value);
  };

  const fetchAllClient = async () => {


 
    
    const client_uid = Props.client;
    const clientProfile = doc(db, "Users", client_uid);
    const clientProfileSnap = await getDoc(clientProfile);

    const AllCourses = doc(db, "Courses", "français");
    const offercours = await getDoc(AllCourses);

    
    

    if (clientProfileSnap.exists()) {
      console.log(clientProfileSnap.data());
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

    
    
    // const querySnapshotCredit = collection(db, "Users", client_uid, "Comments")
    

    // const docRef = await addDoc(querySnapshotCredit, 
      
    //   {
      
    //   email : user.email,
    //   created_at : new Date(),
    //   comment : textInput
    // }
    // );


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
      <Button onClick={handleOpen}>Ajouter un comentaire</Button>
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
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="course" />}
    />
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

        <br>
        {/* <Grid> 
      <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
        <FormControlLabel
          value="disabled"
          disabled
          control={<Radio />}
          label="other"
        />
      </RadioGroup>
       </FormControl>
       </Grid> */}
        </br>
      
        <Grid> <Button onClick={updateCours} disabled={isDisabled}>Ajouter</Button></Grid> 
        </Box>
         
       
      </Modal>
    </div>
  );
}
