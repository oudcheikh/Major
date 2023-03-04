import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { query, collection, getDocs, getDoc, where, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';


import AnnulCourse from "./annulecourse"
import UpdateCourseDateTime from "./chnagedate"

const currencies = [
  {
    value: 'MRU',
    label: '฿',
  },
];


const formattedDate = (dtime) => {

  const d = new Date(dtime.seconds * 1000 + dtime.nanoseconds / 1000000);
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());
  const hour = String(d.getHours());
  const minutes = String(d.getMinutes());

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};

export default function Course(Props) {
  
  
  const [user, loading, error] = useAuthState(auth);
  const [currency, setCurrency] = React.useState('EUR');
  const [value, setValue] = React.useState();
  const [name, setName] = useState("");
  const [clients, setClient ] = useState([]);
  const [profile, setProfile] = React.useState({});
  const [cours, setCours] = React.useState([]);
  const [datecours, setdatecours] = React.useState();
  const [allclients, setAlltClient ] = useState([]);
  const navigate = useNavigate();


  
  
  const { state } = useLocation();


  console.log(" The state is ................................... : " , state)
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };



    
    const fetchAllClient = async () => {


      const profProfile = doc(db, "Users", state.data.client_uid);
      const profProfileSnap = await getDoc(profProfile);
      
  
     
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
     
    }, []);
  


const GoToProf = async () =>{

    navigate("/user/course/profdispo"
    ,
    
    {
      state: { state },
    }
    );
    
  };

  
  return (
    <Box sx={{
      padding: 20,
      display: 'row',
      justifyContent: 'center',
      p: 10,
      m: 1,
      bgcolor: 'background.paper',
      borderRadius: 1, }}>
      
      <ul>
      
          <li>Course : {state.data.course}</li>
          <li>Duré : {state.data.duration}</li>
          <li>Date : {formattedDate(state.data.date)}</li> 
          <li>Price : {state.data.price}</li>
      </ul>

      <ul>
      
          <li>firstname : {profile.firstname}</li>
          <li>listname : {profile.lastname}</li>
          <li>Numero client : {profile.phone}</li>
          <li>Adresse : {profile.adress}</li>
          <li>Quartier  : {profile.quartier}</li>
       
      </ul>


      {state.data.statut == 1 &&
      <ul> 
      <li>prof : {state.data.prof}</li>
      <li>prof_number : {state.data.prof_number}</li>
      </ul>

          }
      
      <Grid container spacing={2}>
       
      

        <Grid  xs={12}>
          
        
        
        
        {state.data.userType == 1 &&
        
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}>

       <Grid  xs={6}>
       <Paper elevation={3}> le parent : {profile.firstname}   </Paper>
       </Grid>
        
        <Grid  xs={6}>
        <Paper elevation={3}> Enfent : {state.data.kid} </Paper>
        </Grid>
        </Box>

        }
        
        </Grid>

      </Grid>

      
      <Grid  xs={12}>
      
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
            }}
            >
     
     {state.data.statut == 0 &&
     <Button 
        onClick={GoToProf} 
        sx={{ color: 'yellow', 
        backgroundColor: 'blue', 
        borderColor: 'green' }}  > 
     Trouver un prof pour ce course 
     </Button> }
    </Box>
    
    </Grid>
    <Grid  xs={12}>
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      {state.data.statut == 0 &&
      <AnnulCourse props = {state.data}/>
      }
      </Box>
    </Grid>

    <Grid  xs={12}>
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      
      {state.data.statut == 0 &&
      <UpdateCourseDateTime props = {state.data}/>
      }
      
      
      </Box>
    </Grid>
    
    </Box>
    );
  }
