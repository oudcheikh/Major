
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "./../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CoursHistory from "./history"

import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid';


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


console.log("Package .......................... : ", state)

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
                <Typography gutterBottom variant="h5" component="div">
                  Nom_client : {state.data.client_number}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                Nom_client : {state.data.classroom}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                total_entrant : {state.data.total_entrant}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                total_sortant  : {state.data.total_sortant}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                prof_number : {state.data.prof_number}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                prof_signed : {state.data.prof_signed}
                </Typography>
              </CardContent>
            </Card>
          </Box>
      </Grid>
      <Grid item xs={12} md={6}>
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



