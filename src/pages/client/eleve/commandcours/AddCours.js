import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db,functions } from "../../../../firebase";
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
import de from 'date-fns/locale/de';
import enGB from 'date-fns/locale/en-GB';
import zhCN from 'date-fns/locale/zh-CN';
import { httpsCallable } from "firebase/functions";

dayjs.extend(advancedFormat);

const locales = { 'en-us': undefined, 'en-gb': enGB, 'zh-cn': zhCN, de };


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

const course_type = [{course_type: "Cours individuel à domicile", index:1}, 
 
{course_type:"Cours individuel à distance", index:2}, 


]






export default function AddCours(Props) {

  const [locale, setLocale] = React.useState('en-us');

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [offre, setoffre] = React.useState([]);
  const [nclient, setnclient] = React.useState('');
  const [price, setprice] = React.useState('');
  const [cours, setcours] = React.useState();
  const [serie, setserie] = React.useState('');
  const [valueDateTile, setValue] = React.useState(new Date());
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const formRef = React.useRef();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [nbHour, setnbHour] = React.useState(1);
  const [coursType, setcourType] = React.useState("Cours individuel à domicile");



  const getprice = (cours, nbHeur, mycoursType, serie ) => {
  const getCoursPrice = httpsCallable(functions, 'getCoursePrice');
    let place = 1 ;
  if (mycoursType == "Cours individuel à distance") {
    place = 2;
  }

  console.log("coursType .................  : ",   coursType)
  console.log("cours : ", cours , 
              "classroom : ", profile.classroom,
              "serie : ", serie, 
              "userCity : ", profile.city,
              "duration :", nbHeur,
              "place :",  place,
              )
  
  getCoursPrice({
    matiere: cours,
    classroom : profile.classroom,
    serie :serie,
    city : profile.city,
    quartier :profile.quartier,
    nbHeur : nbHeur,
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

  function handleInputChange(event, value) {
    setcours(value);
   setprice(getPriceByCourse(offre, value)[profile.classroom.split(" ")[1]]);
   getprice(value, nbHour, coursType, serie);
  }

  function handleInputChangeSerie(event, value) {
    setserie(value);
    getprice(cours, nbHour, coursType, value);
   
  }

  const [textInput, setTextInput] = React.useState('');
  const [textInputPrix, setTextInputPrix] = React.useState();

  const handleTextInputChangeTypeCours = event => {
      
    setTextInputPrix(event.target.value);

      // setprice(event.target.value)

      // if (event.target.value.trim() === '') {
      //   setprice(getPriceByCourse(offre, cours)[profile.classroom.split(" ")[1]])
      // }


  };

  const handleTextInputChange = event => {
      setTextInput(event.target.value);
  };


  const handleTextInputChangenclient = event => {
    setnclient(event.target.value);
};

function handleInputChangeTypeCours(event, value) {
  setcourType(value);
  getprice(cours, nbHour, value, serie);
 
}

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


    const cours_type =  course_type.filter(element => element.course_type === coursType)[0].index;

    
    let prix =  textInputPrix;


    // offre.filter(element => element.cours === cours)

    const querySnapshotCredit = collection(db, "Users", client_uid, "Courses")
    
    const docRef = await addDoc(querySnapshotCredit, 
      {
        booking_date : new Date(),
        classroom : profile.classroom,
        client_uid : client_uid,
        course : cours,
        date : valueDateTile.toDate(),
        duration : nbHour,
        noted : false,
        price : Number(prix) ,
        prof : ""  ,
        prof_number : "",
        prof_uid :"",
        serie : profile.serie ? profile.serie:serie,
        statut : 0,
        statut_date : new Date(),
        subject : textInput,
        num_client : profile.phone,
        userType : 3 ,
        by: user.email,
        type: cours_type,
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
        <Grid xs={12}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={offre.map((option) => option.course)}
          onInputChange={handleInputChange}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="course" 
          />}/>
        </Grid>
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
        <br/>
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
        <FormControlLabel value = "2" control={<Radio />} label="2h" />
        <FormControlLabel value ="3" control={<Radio />} label="3h" />
        <FormControlLabel value ="4" control={<Radio />} label="4h" />
      </RadioGroup>
    </FormControl>
    </div>
       </Grid> 

        <br></br>
        
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
       <br>
        </br>
        <Grid xs={12}>
          Prix ( {nbHour} h) : {price}
        </Grid>
        <br></br>
        {/* { (coursType =="Cours package à domicile" || coursType == "Cours package à distance") && */}
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
