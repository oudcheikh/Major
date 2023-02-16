import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddModal from "./addenfentmodal"
import { query, collection, getDocs, getDoc, where, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const currencies = [
  {
    value: 'MRU',
    label: '฿',
  },
];

export default function AjouterEnfent() {
  
  
  const [user, loading, error] = useAuthState(auth);
  const [currency, setCurrency] = React.useState('EUR');
  const [firstname, setFirstname] = React.useState();
  const [lastname, setLastname] = React.useState();
  const [school, setSchool] = React.useState();
  const [birthdate, setBirthdate] = React.useState();
  const [classroom, setClassroom] = React.useState();


  const { state } = useLocation();
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };


  return (

<div>
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      Ajouter un enfents
    </Box>
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
          id="outlined-number"
          label="firstname"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={firstname} onChange={(e) => setFirstname(e.target.value)} 
        />
    </Box>
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
          id="outlined-number"
          label="lastname"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={lastname} onChange={(e) => setLastname(e.target.value)} 
        />
    </Box>

    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
          id="outlined-number"
          label="school"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={school} onChange={(e) => setSchool(e.target.value)} 
        />
    </Box>

    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
          id="outlined-number"
          label="birthdate"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          value={birthdate} onChange={(e) => setBirthdate(e.target.value)} 
        />
    </Box>
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
          id="outlined-number"
          label="classroom"
          value={classroom} onChange={(e) => setClassroom(e.target.value)} 
        />
    </Box>

    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
  <AddModal props = {state.uid}  
                    firstname={firstname}
                    school ={school}
                    classroom ={classroom}
                    /> 
    </Box>
    </div>
  );
}
