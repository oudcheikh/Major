import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
// import CreditModal from "./creditmodal"
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'
import ActiveProf from "./activation/activeProfmodal"
import DeactiveProf from "./activation/desactiveProfmodal"
import DeblockProf from "./block/deblockProfmodal";
import BlockProf from './block/blockProfmodal';
import AgreedProf from './agreed/agreedProfmodal'
import DesagreedProf from './agreed/desagreedProfmodal'
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

export default function Gerer() {
  
  
  const [user, loading, error] = useAuthState(auth);
  const [currency, setCurrency] = React.useState('EUR');
  const [value, setValue] = React.useState();
  const [checkedIsActive, setCheckedIsActive] = React.useState(true);
  const [checkedIsBloked, setCheckedIsBloked] = React.useState(true);


  const { state } = useLocation();

  


  const handleChangeIsActive = (event) => {

    setCheckedIsActive(event.target.checked);
  };

  const handleChangeIsBlocked = (event) => {

    setCheckedIsActive(event.target.ischecked);
  };

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
    </Box>

    {!state.data.isAgreed &&
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
           <AgreedProf props = {state.data} />
         </Box>
         }

    {state.data.isAgreed &&
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
           <DesagreedProf props = {state.data} />
         </Box>
         }



    {!state.data.isActif &&
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
           <ActiveProf props = {state.data} />
         </Box>
         }

    {state.data.isActif &&
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
           <DeactiveProf props = {state.data} />
         </Box>
         }

{!state.data.isBlocked &&
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
           <BlockProf props = {state.data} />
         </Box>
         }

    {state.data.isBlocked &&
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
           <DeblockProf props = {state.data} />
         </Box>
         }


    </div>
  );
}
