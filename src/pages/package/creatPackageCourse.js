import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db, functions } from "./../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import de from 'date-fns/locale/de';
import enGB from 'date-fns/locale/en-GB';
import zhCN from 'date-fns/locale/zh-CN';
import { getFunctions, httpsCallable } from "firebase/functions";

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
{course_type: "Cours package à domicile", index:2}, 
{course_type:"Cours individuel à distance", index:3}, 
{course_type:"Cours package à distance", index:4},
{course_type:"Cours chez Major", index:5}
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
  const [valuen, setValuen] = React.useState(1);
  const [coursType, setcourType] = React.useState("Cours individuel à domicile");

  const adminCreatePackageCourse = httpsCallable(functions, 'adminCreatePackageCourse');
  const adminAttributeCourse = httpsCallable(functions, 
    'adminAttributeCourse');

  const handleChange = (event) => {
    setValuen(event.target.value);
  };

  function handleInputChange(event, value) {
    setcours(value);
   setprice(getPriceByCourse(offre, value)[profile.classroom.split(" ")[1]])
  }

  function handleInputChangeSerie(event, value) {
    setserie(value);
   
  }

  const [textInput, setTextInput] = React.useState('');
  const [textInputPrix, setTextInputPrix] = React.useState(2);

  const handleTextInputChangeTypeCours = event => {
      setTextInputPrix(event.target.value);
     
  };

  const handleTextInputChange = event => {
      setTextInput(event.target.value);
  };


  const handleTextInputChangenclient = event => {
    setnclient(event.target.value);
};

function handleInputChangeTypeCours(event, value) {
  setcourType(value);
 
}


  React.useEffect(() => {

  
    if (loading) return;
    if (!user) return navigate("/");

    //fetchAllClient();
  }, []);

  const closeModal = async () => {
    setOpen(false)
  }



  const creatCours = async () => {


    setIsDisabled(true)


    if (textInputPrix < 0 )
    {
      // setOpen(false);
      return;
    }
    let params = {}
    console.log(" in attrubute prof ________________________________ Props.p_data : ", Props.p_data)
    params = { courseKey: Props.p_data.uid,  
    clientUid : Props.p_data.client_uid,
    profUid : Props.p_data.prof_uid,
    isPackage:false, 
    isPackageCourse:true}

    console.log(" in params prof ________________________________ Props.p_data : ", params)



    let courseKey = ""
  
    adminCreatePackageCourse({

      "packageKey": Props.p_data.uid,
      "date": valueDateTile.toDate(),
      "numHeur": textInputPrix,
      "sujet":textInput,

    })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;

        
       
        if (data.success) {

          courseKey = data.courseKey
          console.log("__________data________________ data : ",data.courseKey)
          params = { "courseKey": courseKey,  
              "clientUid" : Props.p_data.client_uid,
              "profUid" : Props.p_data.prof_uid,
              "isPackage":false, 
              "isPackageCourse":true         
            }

             setOpen(false);
            navigate("/package");
    
  // adminAttributeCourse(params)
  //    .then((result) => {
  //      // Read result of the Cloud Function.
  //      /** @type {any} */
  //      const data = result.data;
  //      const sanitizedMessage = data.text;
       

  //      if (data.success) {
  //        setOpen(false);
  //       navigate("/package");
        

  //      }

  //      else {
  //       setOpen(false);
  //      }

  // //     const profList = data.profList;
  //    });
        }
        else {
          setOpen(false);
        }
        //     const profList = data.profList;
      });


      console.log("__________courseKey________________ courseKey : ",courseKey)

      
    // assigner un cours


    
  
    


  };;

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
        <br></br>
         <Grid xs={12}> 
         <div>
    </div>
       </Grid> 
       <br>
        </br>
        {/* { (coursType =="Cours package à domicile" || coursType == "Cours package à distance") && */}
        <Grid xs={12}>
          <TextField
        id="outlined-number"
          label="Number Heur"
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

<Grid xs={6}> <Button onClick={creatCours} disabled={isDisabled}>Add</Button>
        <Button onClick={closeModal} disabled={isDisabled}>close</Button></Grid>
        <Grid xs={6}>    </Grid> 

        <br>
        </br>

        </Box>
         
       
      </Modal>
      </Box>
    </div>
  );
}