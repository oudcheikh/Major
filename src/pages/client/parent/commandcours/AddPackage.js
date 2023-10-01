import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
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

const course_type = [
{ course_type: "package à domicile", index: 1 },
{ course_type: "package à distance", index: 2 },
]




export default function AddPackage(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [offre, setoffre] = React.useState([]);
  const [nclient, setnclient] = React.useState(0);
  const [NumKids, setNumKids] = React.useState(0);
  const [NumWeeks, setNumWeeks] = React.useState(0);
  const [NumHperWeeks, setHperWeeks] = React.useState(0);
  const [price, setprice] = React.useState('');
  const [cours, setcours] = React.useState();
  const [children, setchildren] = React.useState([]);
  const [selectedchildren, setselectedchildrenchildren] = React.useState('');
  const [coursType, setcourType] = React.useState("Cours individuel à domicile");
  const [offercours, setoffercours] = React.useState()
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

  function handleInputChangeSetSelectedChildern(event, value) {
    setselectedchildrenchildren(value);
    // console.log(' selected children ................', value)
    // let classroom = clientProfileSnap.data().classroom.split(" ");    

    let thisclassroom = children.filter(element => element.firstname === value)[0].classroom.split(" ");
    setoffre(offercours.data()[thisclassroom[0]].filter(element => element.actif === true))


  }

  function handleInputChange(event, value) {
    setcours(value);

    // let thisclassroom = children.filter(element => element.firstname === selectedchildren)[0].classroom.split(" ");
    // setprice(getPriceByCourse(offre, value)[thisclassroom[1]])

  }

  function handleInputChangeTypeCours(event, value) {
    setcourType(value);

  }

  const [textInput, setTextInput] = React.useState('');
  const [textInputPrix, setTextInputPrix] = React.useState();

  // const handleTextInputChangeTypeCours = event => {
  //   setTextInputPrix(event.target.value);
  //   // setprice(event.target.value)
    
  //   // if (event.target.value.trim() === '') {

  //   //   let thisclassroom = children.filter(element => element.firstname === selectedchildren)[0].classroom.split(" ");
  //   //   setprice(getPriceByCourse(offre, cours)[thisclassroom[1]])
  //   // }
  // };

  const handleTextInputChange = event => {
    setTextInput(event.target.value);
  };

  const handleTextInputChangenclient = event => {
    setnclient(event.target.value);
  };

  const handleNumKids = event => {
    setNumKids(event.target.value);
  }



  const handleNumWeeks = event => {
    setNumWeeks(event.target.value);
  }

  const handleHperWeeks = event => {
    setHperWeeks(event.target.value);
  }

  const fetchAllClient = async () => {

    console.log("deeededededed ")
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

    // const client_uid = Props.client
    //const cours_type = course_type.filter(element => element.course_type === coursType)[0].index;
   console.log(profile)
   //let newnumPackage = profile.numPackage !== undefined ? profile.numPackage + 1 : 1;


    





  setIsDisabled(true)

      const client_uid = Props.client;
      const clientProfile = doc(db, "Users", client_uid);
      const clientProfileSnap = await getDoc(clientProfile);

      const AllCourses = doc(db, "Courses", "français");
      const offercours = await getDoc(AllCourses);

      // let thisclassroom = children.filter(element => element.firstname === selectedchildren)[0].classroom.split(" ");

     
      const cours_type = course_type.filter(element => element.course_type === coursType)[0].index;
      // offre.filter(element => element.cours === cours)

      let newnumPackage = profile.numPackage !== undefined ? profile.numPackage + 1 : 1;
      
      await updateDoc(clientProfile, {
        numPackage: newnumPackage
     });

      const querySnapshotCredit = collection(db, "Packages")
      const docRef = await addDoc(querySnapshotCredit,
        {
          booking_date: new Date(),
          classroom: children.filter(element => element.firstname === selectedchildren)[0].classroom,
          client_uid: client_uid,
          client_nom: profile.firstname + ' ' + profile.lastname,
          client_number: profile.phone,
          course: cours,
          //date : valueDateTile.toDate(),
          client_signed: false,
          client_signed_date: new Date(0),
          comment: textInput,
          numWeek: Number(NumWeeks),

          heure_booked: 0,
          heure_done: 0,

        
          heure_totale: Number(NumWeeks*NumHperWeeks),
          kid: children.filter(element => element.firstname === selectedchildren)[0].firstname + ' ' + children.filter(element => element.firstname === selectedchildren)[0].lastname,
          manager: "",
          numHour: Number(NumHperWeeks),// nombre d'heure par seamine,
          numKid: Number(NumKids),
          numPackage: Number(newnumPackage),// il faut le faire automatiquement,

          pourcentage_promo: 0,
          prix_heure: 0,
          prix_totale_applicable: 0,
          prof_nom: "",
          prof_number: "",
          prof_signed: false,
          prof_signed_date: new Date(0),
          prof_uid: "",
          type: cours_type,
          serie: children.filter(element => element.firstname === selectedchildren)[0].serie ? children.filter(element => element.firstname === selectedchildren)[0].serie : '',
          statut: 0,
          statut_date: new Date(0),
          total_entrant: 0,
          total_sortant: 0,
          //type :
          userType: 1,
          by: user.email,
          from: "website",
          valeur_depense : 0,

        }
      )
        ;
      setOpen(false)
      const phone = ""
      const data = ""
      const uid = client_uid

      navigate("/package",
        {
          state: { uid },
        });
      setIsDisabled(false);
  
  };

  return (
    <div>


      <Button onClick={handleOpen}>Ajouter un package</Button>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
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
                  />} />
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
                  />} />
              </Grid>
            </div>
            <br />
            <Grid xs={12}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={course_type.map((option) => option.course_type)}
                onInputChange={handleInputChangeTypeCours}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="courseType"
                />} />
            </Grid>
            <br />
            <Grid xs={12}><TextField
              label="Comment"
              multiline
              rows={1}
              defaultValue=" "
              onChange={handleTextInputChange}
              inputProps={{ maxLength: 64 }}
              style={{ width: 300 }}
            /></Grid>

            <br />

            <Grid xs={12}>  <TextField
              label="Nombre enfent"
              onChange={handleNumKids}
              inputProps={{ maxLength: 64, max: 4, min:1 }}
              style={{ width: 300 }}
              type="number"
              required
            /></Grid>
            <br />

            <Grid xs={12}>  <TextField
              label="nomber semaine"
              onChange={handleNumWeeks}
              inputProps={{ maxLength: 30, max: 10, min : 1 }}
              style={{ width: 300 }}
              type="number"
              required
            /></Grid>
            <br />
            <Grid xs={12}>  <TextField
              label="nomber d'heure par semaine"

              onChange={handleHperWeeks}
              inputProps={{ maxLength: 30 , max: 30, min : 1 }}
              style={{ width: 300 }}
              type="number"
              required
            /></Grid>

            <Grid xs={6}> <Button onClick={updateCours} disabled={isDisabled}>Add</Button>

              <Button onClick={closeModal} disabled={isDisabled}>close</Button></Grid>
            <Grid xs={6}>    </Grid>

          </Box>


        </Modal>
      </Box>
    </div>
  );
}
