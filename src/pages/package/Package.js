
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "./../../firebase";
import CoursHistory from "./history";
import SetPackagePrice from "./setprice"
import MoveStatus from "./movePackageStatus"
import AddCours from "./creatPackageCourse"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import React, { useEffect } from "react";


const formatPackageStatus = (status) => {
  if (status == 0) {
    return " 🚣Nouveau Package";
  }
  if (status == 1)
  {
    return "🚣 🚣 Package pret  "
  }
  if (status == 2)
  {
    return "🚣 👌 Package comfirmé "
  }
  if (status == 3)
  {
    return "🚣 👌 👌 Package complet "
  }
  if (status == -1)
  {
    return "🚩 Package annulé par le professeur "
  }
  if (status == -2)
  {
    return "🚩 🚩 Package suspendu par le professor "
  }

  if (status == -3)
  {
    return "🚩 👎 Package annulé par le client"
  }
  if (status == -4)
  {
    return "Package no signé par le client"
  }
  if (status == -5)
  {
    return "🚩 annulé Package par l'admin"
  }
};

function TabPanel(props) {

  
  const { children, value, index, ...other } = props;

  

 


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MyPackage() {


  const [value, setValue] = React.useState(0);
  const { state } = useLocation();
  const [user, loading, error] = useAuthState(auth);

  const [notifications, setnotifications] = React.useState([]);
  const [notes, setnotes] = React.useState([]);
  const [cours, setCours] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [uid, setUid] = React.useState("");

  const navigate = useNavigate();
  const GoToProf = async () => {

    navigate("/user/course/profdispo"
      ,
      {
        state: { state },
      }
    );

  };

  const fetchAllClient = async () => {

    const profProfile = doc(db, "Users", state.uid);
    const profProfileSnap = await getDoc(profProfile);
    const Cours = [];
    const querySnapshotCourse = collection(db, "Users", state.data.client_uid, "Courses")
    onSnapshot(querySnapshotCourse, (querySnapshot) => {
      querySnapshot.forEach((doc) => {

        Cours.push(doc.data())
      });
      setCours(Cours)
    });

    const notes = [];
    const querySnapshotnotes = collection(db, "Users", state.uid, "Notes")
    onSnapshot(querySnapshotnotes, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        notes.push(doc.data())
      });
      setnotes(notes)
    });

    const notifications = [];
    const querySnapshotnotifications = collection(db, "Users", state.uid, "Notifications")
    onSnapshot(querySnapshotnotifications, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        notifications.push(doc.data())

      });
      setnotifications(notifications)
    });
    if (profProfileSnap.exists()) {

      setProfile(profProfileSnap.data())
    } else {
      // doc.data() will be undefined in this case

    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchAllClient();
    setUid(state.uid)
  }, []);


  const [expanded, setExpanded] = React.useState(false);


  // "/profProfile/notes"


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


    console.log("state.data : ", state.data)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}>
          <Card sx={{ maxWidth: 345 }} style={{ alignSelf: 'center' }} >
            {/* <Avatar alt="Travis Howard" style={{ alignSelf: 'center' }} /> */}
            <CardContent>

            <Typography gutterBottom variant="h7" component="div">
                Statut : {formatPackageStatus(state.data.statut)}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                manager : {state.data.manager}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                client_nom : {state.data.client_nom}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                enfant : {state.data.kid}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                numPackage : {state.data.numPackage}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                client_number : {state.data.client_number}
              </Typography>

              <Typography variant="h7" component="div">
                client_signed : {state.data.client_signed === true ? "Oui" : "Non"}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                classroom : {state.data.classroom}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                serie : {state.data.serie}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                course : {state.data.course.split(" - ").pop()}
              </Typography>

              
              <Typography gutterBottom variant="h7" component="div">
                number_heure_semaine : {state.data.numHour}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                number_semaine : {state.data.numWeek}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                heure_totale : {state.data.heure_totale}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                comment : {state.data.comment}
              </Typography>

              <Typography gutterBottom variant="h7" component="div">
                heure_faite : {state.data.heure_done}
              </Typography>
              <Typography gutterBottom variant="h7" component="div">
                heures_bookés : {state.data.heure_booked}
              </Typography>
              <Typography variant="h7" component="div">
                prof_nom : {state.data.prof_nom}
              </Typography>
              <Typography variant="h7" component="div">
                prof_number : {state.data.prof_number}
              </Typography>
              <Typography variant="h7" component="div">
                prof_signed : {state.data.prof_signed === true ? "Oui" : "Non"}
              </Typography>
              <Typography variant="h7" component="div">
                prix_heure : {state.data.prix_heure} MRU
              </Typography>
              <Typography variant="h7" component="div">
                prix_totale_applicable : {state.data.prix_totale_applicable} MRU
              </Typography>
              <Typography variant="h7" component="div">
                total_entrant : {state.data.total_entrant} MRU
              </Typography>
              <Typography variant="h7" component="div">
                total_sortant  : {state.data.total_sortant} MRU
              </Typography>
              <Typography variant="h7" component="div">
              valeur_depense  : {state.data.valeur_depense} MRU
              </Typography>
              
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>


      
      {state.data.prof_nom == "" > 0    && state.data.prix_totale_applicable > 0  &&
          <ul>
            <Button
              onClick={GoToProf}
              sx={{
                color: 'yellow',
                backgroundColor: 'blue',
                borderColor: 'green'
              }} >
              find prof
            </Button>
          </ul> } 
          {state.data.prix_totale_applicable == 0  &&
          <ul>
            <SetPackagePrice  p_data={state.data}/>
          </ul>
}
          <ul>
            <MoveStatus  p_data={state.data}/>
          </ul>
      {state.data.statut == 2  && 
          <ul>
            <AddCours  p_data={state.data}/>
          </ul>
        }
        <Box>
          <Tabs value={value} onChange={handleChange} variant="scrollable"
            scrollButtons="auto" >
            <Tab label="Activité" {...a11yProps(0)} />

          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <h1>Activité : </h1>
          <CoursHistory package_uid={state.data.uid} client={state.data.client_uid} />
        </TabPanel>
      </Grid>
    </Grid>
  );
}



