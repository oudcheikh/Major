
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CoursHistory from "./history"
import NotesHistory from "./notes"
import NotificationHistory from "./notifications"
import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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

export default function StudentfProfile() {


  const [value, setValue] = React.useState(0);
  const { state } = useLocation();
  const [user, loading, error] = useAuthState(auth);

  const [notifications, setnotifications] = React.useState([]);
  const [notes, setnotes] = React.useState([]);
  const [cours, setCours] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [uid, setUid] = React.useState("");
  const [switchstate, setswitchstate] = React.useState(state.data.isAgreed);

  
  const navigate = useNavigate();


  const fetchAllClient = async () => {



    const profProfile = doc(db, "Users", state.uid);
    const profProfileSnap = await getDoc(profProfile);
    const Cours = [];
    const querySnapshotCourse = collection(db, "Users", state.uid, "Courses")
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



  return (
    <div>
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        <Card sx={{ maxWidth: 345 }} style={{ alignSelf: 'center' }} >
          {/* <Avatar alt="Travis Howard" style={{ alignSelf: 'center' }} /> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Nom : {state.data.lastname}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              Prenon : {state.data.firstname}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Phone : {state.data.phone}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              notes : {state.data.notes} MRU
            </Typography>
            <Typography variant="h5" color="text.secondary">
              classroom : {state.data.classroom}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Activité" {...a11yProps(0)} />
          <Tab label="notes" {...a11yProps(1)} />
          <Tab label="Notifications" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <h1>Activité : </h1>
        <CoursHistory cours = {cours} client = {state.uid}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <h1>Note  NotesHistory : </h1>
        <NotesHistory notes = {notes} client = {state.uid}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <h1>Activité NotificationHistory : </h1>
        <NotificationHistory notifications = {notifications} client = {state.uid}/>
      </TabPanel>
    </Box>
    </div>
  );
}



