import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CreditModal from "./creditmodal"
import { query, collection, getDocs, getDoc, where, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const currencies = [
  {
    value: 'MRU',
    label: '฿',
  },
];

export default function Credit() {
  
  
  const [user, loading, error] = useAuthState(auth);
  const [currency, setCurrency] = React.useState('EUR');
  const [value, setValue] = React.useState();

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
      Update credit
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
          label="Credit en MRU"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={value} onChange={(e) => setValue(e.target.value)} 
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
  <CreditModal props = {state.uid}  credit_value={value} /> 
    </Box>
    </div>
  );
}
