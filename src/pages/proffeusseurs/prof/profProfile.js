// import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../firebase";
import CoursHistory from "./activite/history";
import CommentModal from "./comment/Comment";
import CommenttHistory from "./comment/history";
import CreditHistory from "./credit/history";
import Gerer from "./gestion/generer";
import NotationHistory from "./notation/history";
import ActiveOffre from "./offres/listActiveOffre";
import DesActiveOffre from "./offres/listDesActiveOffre";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';

const formattedDate = (d) => {
  let month = ("0" +(d.getMonth()+1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());

  return `${day}/${month}/${year}`;
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

export default function ProfProfile(Props) {
  const [value, setValue] = React.useState(0);

  const { state } = useLocation();
  const [user, loading, error] = useAuthState(auth);

  const [ratings, setRatings] = React.useState([]);
  const [credit, setCredit] = React.useState([]);
  const [cours, setCours] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [uid, setUid] = React.useState("");
 

  
  const navigate = useNavigate();

  const handleswitchChange = (event, newValue) => {
   
    setValue(newValue);
  };

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

    const Credit = [];
    const querySnapshotCredit = collection(db, "Users", state.uid, "Credit")
    onSnapshot(querySnapshotCredit, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Credit.push(doc.data())
      });
      setCredit(Credit)
    });

    const Ratings = [];
    const querySnapshotRatings = collection(db, "Users", state.uid, "Ratings")
    onSnapshot(querySnapshotRatings, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Ratings.push(doc.data())

      });
      setRatings(Ratings)
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



  const cars = [
    {id: 1, brand: 'Ford'},
    {id: 2, brand: 'BMW'},
    {id: 3, brand: 'Audi'}
  ];

  const [expanded, setExpanded] = React.useState(false);

  const handleChangeActivity = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

// "/profProfile/credit"

const goToCredit = () => {

  navigate("/profProfile/credit",
    {
     state: {  uid },
    }
    );
};

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
              Nom : {profile.lastname}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              Prenon : {profile.firstname}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Phone : {profile.phone}
            </Typography>

            <Typography variant="h5" color="text.secondary">
              Niveau etude : {profile.studyLevel}
            </Typography>
            
            {/* <Typography variant="h5" color="text.secondary">
              Credit : {state.data.credit} MRU
            </Typography> */}
            
            <Typography variant="h5" color="text.secondary">
            city : {profile.city}
            </Typography>


            <Typography variant="h5" color="text.secondary">
            quartier : {profile.quartier}
            </Typography>

            
            <Typography variant="h5" color="text.secondary">
            adresse : {profile.adress}
            </Typography>


          </CardContent>
        </Card>
      </Box>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Activité" {...a11yProps(0)} />
          <Tab label="Credit" {...a11yProps(1)} />
          <Tab label="Offres_Validés" {...a11yProps(2)} />
          <Tab label="Offres_Non_Validés" {...a11yProps(3)} />
          <Tab label="Notations" {...a11yProps(4)} />
          <Tab label="Gestion" {...a11yProps(5)} />
          <Tab label="Commentairs" {...a11yProps(6)} />
        </Tabs>
        
      </Box>
      <TabPanel value={value} index={0}>
        <h1>Activité : </h1>
        <CoursHistory cours = {cours} prof = {state.uid}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
         <Button onClick={goToCredit}> Update Credit </Button>
         <CreditHistory credit = {credit} prof = {state.uid}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <ActiveOffre state = {state.data} prof = {state.uid}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <DesActiveOffre state = {state.data} prof = {state.uid}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <NotationHistory ratings = {ratings} prof = {state.uid}/> 
      </TabPanel>
      <TabPanel value={value} index={5}>
      <Gerer state = {state.data} prof = {state.uid}/> 
      </TabPanel>

      <TabPanel value={value} index={6}>
      <CommentModal state = {state.data} prof = {state.uid}/>
      <CommenttHistory  prof = {state.uid}/>
      </TabPanel> 

    </Box>
    </div>
  );
}
