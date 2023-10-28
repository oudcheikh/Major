import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db, functions } from "../../../../firebase";
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
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { httpsCallable } from "firebase/functions";

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

function getPriceByCourse(courses, course) {
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].course === course) {
      return courses[i].priceSA ;
    }
  }
  return null;
}

dayjs.extend(advancedFormat);

const course_type = [{course_type: "Cours individuel à domicile", index:1}, 

{course_type:"Cours individuel à distance", index:3}]




export default function AddCours(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [offre, setoffre] = React.useState([]);
  const [nclient, setnclient] = React.useState('');
  const [price, setprice] = React.useState('');
  const [cours, setcours] = React.useState();
  const [children, setchildren] = React.useState([]);
  const [classroom, setClassroom] = React.useState('');
  const [selectedchildren, setselectedchildrenchildren] = React.useState('');
  const [coursType, setcourType] = React.useState("Cours individuel à domicile");
  const [offercours, setoffercours] = React.useState()
  const [valueDateTile, setValue] = React.useState(new Date());
  const [serie, setserie] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const formRef = React.useRef();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [nbHour, setnbHour] = React.useState(1);


  const getprice = (cours, nbHour, mycoursType, serie ) => {
    const getCoursPrice = httpsCallable(functions, 'getCoursePrice');
      let place = 1 ;
    if (mycoursType == "Cours individuel à distance") {
      place = 2;
    }
  
    console.log("coursType .................  : ",   place)
    console.log("cours ::::  : ", cours , 
                "classroom !::::: : ", classroom,
                "serie :::: : ", serie, 
                "userCity :::: : ", profile.city,
                "quartier ::: ", profile.quartier,
                "duration::: :", nbHour,
                "place :::::",  place,
                )
    
    getCoursPrice({
      matiere: cours,
      classroom : classroom,
      serie :serie,
      city : profile.city,
      quartier :profile.quartier,
      nbHeur : nbHour,
      place : place,
    })
      .then((result) => {
        const data = result.data;
          console.log(result)
        if (data.success) {
  
          setprice(result.data.price)
          return result
        }
        else {
          return {}
        }
      });
    }
  

  const handleChange = (event) => {
    setnbHour(event.target.value);
    getprice(cours, event.target.value, coursType, serie)
  };

  function handleInputChangeSetSelectedChildern(event, value) {
    setselectedchildrenchildren(value);
    // console.log(' selected children ................', value)
    //let classroom = clientProfileSnap.data().classroom.split(" ");    
    
    let thisclassroom = children.filter(element => element.firstname === value)[0].classroom;
    setClassroom(thisclassroom)
    setoffre(offercours.data()[thisclassroom.split(" ")[0]].filter(element => element.actif === true))
 

  }

  function handleInputChange(event, value) {
    setcours(value);

   let thisclassroom = children.filter(element => element.firstname === selectedchildren)[0].classroom.split(" ");
   
   getprice(value, nbHour, coursType, serie);

  }

  function handleInputChangeSerie(event, value) {
    setserie(value);
    getprice(cours, nbHour, coursType, value);
   
  }

  function handleInputChangeTypeCours(event, value) {
    setcourType(value);
    getprice(cours, nbHour, value, serie);
   
  }

  const [textInput, setTextInput] = React.useState('');
  const [textInputPrix, setTextInputPrix] = React.useState();

  const handleTextInputChangeTypeCours = event => {
      setTextInputPrix(event.target.value);
      
  };

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


    const children = [];
    const querySnapshotCourse = collection(db, "Users", client_uid, "Children")
    onSnapshot(querySnapshotCourse, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
    
        children.push(doc.data())
      });
      setchildren(children)
    });

  
    if (clientProfileSnap.exists()) {
      setProfile(clientProfileSnap.data());
    } else {
      console.log("``");
    }


    if (offercours.exists()) {
      setoffercours(offercours)
    } else {
      console.log("``");
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

  const updateCours = async () => {

    



    setIsDisabled(true)
    
    const client_uid = Props.client;
    const clientProfile = doc(db, "Users", client_uid);
    const clientProfileSnap = await getDoc(clientProfile);

    const AllCourses = doc(db, "Courses", "français");
    const offercours = await getDoc(AllCourses);

    let thisclassroom = children.filter(element => element.firstname === selectedchildren)[0].classroom.split(" ");

    let prix =  textInputPrix;

    const cours_type =  course_type.filter(element => element.course_type === coursType)[0].index;
    // offre.filter(element => element.cours === cours)
    const querySnapshotCredit = collection(db, "Users", client_uid, "Courses")
    
    const docRef = await addDoc(querySnapshotCredit, 
      {
        booking_date : new Date(),
        classroom : children.filter(element => element.firstname === selectedchildren)[0].classroom,
        kid : selectedchildren + ' ' + children.filter(element => element.firstname === selectedchildren)[0].lastname,
        client_uid : client_uid,
        course : cours,
        date : valueDateTile.toDate(),
        duration : nbHour,
        noted : false,
        price : Number(prix) ,
        prof : ""  ,
        prof_number : "",
        prof_uid :"",
        serie : children.filter(element => element.firstname === selectedchildren)[0].serie ?  children.filter(element => element.firstname === selectedchildren)[0].serie:'',
        statut : 0,
        statut_date : new Date(),
        subject : textInput,
        num_client : nclient,
        userType : 1 ,
        by: user.email,
        from: "website",
        type : cours_type
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
          options={children.map((option) => option.firstname)}
          onInputChange={handleInputChangeSetSelectedChildern}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="enfant" 
          />}/>
        </Grid>
        
        <br>
        </br>
        <Grid xs={6}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={offre.map((option) => option.course)}
          onInputChange={handleInputChange}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="course" 
          />}/>
        </Grid>
        </div>
        <br></br>
       
       <Grid xs={12}>
       <Autocomplete
         disablePortal
         id="combo-box-demo"
         options={[{serie: "C"}, {serie: "D"}, {serie: "A"}, {serie: "O"},{serie: " "}].map((option) => option.serie)}
         onInputChange={handleInputChangeSerie}
         sx={{ width: 300 }}
         renderInput={(params) => <TextField {...params} label="serie" 
         />}/>
       </Grid>
       <br></br>
        <br>
        </br>
        <Grid xs={12}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={course_type.map((option) => option.course_type)}
          onInputChange={handleInputChangeTypeCours}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="courseType" 
          />}/>
        </Grid>
        
        <Grid xs={12}> 
        <div>
     
        <FormControl>
     
     <RadioGroup
       aria-labelledby="demo-controlled-radio-buttons-group"
       name="controlled-radio-buttons-group"
       value={nbHour}
       onChange={handleChange}
       row
     >
       <FormControlLabel value = "1" control={<Radio />} label="1h" />
       <FormControlLabel value="2" control={<Radio />} label="2h" />
       <FormControlLabel value="3" control={<Radio />} label="3h" />
       <FormControlLabel value="4" control={<Radio />} label="4h" />
     </RadioGroup>
   </FormControl>
   </div>
      </Grid> 
      
     
        <Grid xs={12}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="DateTimePicker"
            value={valueDateTile}
            onChange={(newValue) => {
              const dateWithSecondsZero = dayjs(newValue).set('second', 0);
              setValue(dateWithSecondsZero);
            }}
          />
        </LocalizationProvider>

        
        </Grid>
       
          
        <Grid xs={12}>
        Prix ( {nbHour} h) : {price}
        </Grid>
        <br></br>
       
       <Grid xs={12}>
          <TextField
        id="outlined-number"
          label="Prix en MRU"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        
        onChange= {handleTextInputChangeTypeCours}
       
      /></Grid>
        
       
         <br>
        </br>
        



        <Grid xs={12}><TextField
          
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

        
        <Grid xs={6}> <Button onClick={updateCours} disabled={isDisabled}>Add</Button>
        
        <Button onClick={closeModal} disabled={isDisabled}>close</Button></Grid>
        <Grid xs={6}>    </Grid> 

        </Box>
         
       
      </Modal>
      </Box>
    </div>
  );
}
