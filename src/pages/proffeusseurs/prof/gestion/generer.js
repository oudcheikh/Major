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

export default function Gerer(Props) {
  
  
  const [user, loading, error] = useAuthState(auth);
  const [currency, setCurrency] = React.useState('EUR');
  const [value, setValue] = React.useState();
  const [checkedIsActive, setCheckedIsActive] = React.useState(true);
  const [checkedIsBloked, setCheckedIsBloked] = React.useState(true);
  const [profile, setProfile] = React.useState({});

  const [isactif, setisactif] = React.useState(false);
  const [isagreed, setisagreed] = React.useState(false);
  const [isblocked, setisblocked] = React.useState(false);
  
  


  const { state } = useLocation();


  const fetchAllClient = async () => {
  const prof_uid = Props.prof ;

  const profProfile = doc(db, "Users", prof_uid);
  const profProfileSnap = await getDoc(profProfile);


  
    if (profProfileSnap.exists()) {
      setProfile(profProfileSnap.data())
      setisactif(profProfileSnap.data().isActif)
      setisagreed(profProfileSnap.data().isAgreed)
      setisblocked(profProfileSnap.data().isBlocked)



      
    
    } else {
      console.log("``");
    }
  }

  React.useEffect(() => {
 

    fetchAllClient();
    
  }, []);

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

    {!isagreed &&
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
           <AgreedProf isagreed = {isagreed} setisagreed = {setisagreed} prof = {Props.prof} />
         </Box>
         }

    {isagreed &&
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
         
           <DesagreedProf isagreed = {isagreed} setisagreed = {setisagreed} prof = {Props.prof} />
         </Box>
         }



    

{!isblocked &&
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
           <BlockProf isblocked = {isblocked} setisblocked = {setisblocked} prof = {Props.prof} />
         </Box>
         }

    {isblocked &&
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
        
           <DeblockProf isblocked = {isblocked} setisblocked = {setisblocked} prof = {Props.prof}/>
         </Box>
         }

{!isactif &&
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
           <ActiveProf isactif = {isactif} setisactif = {setisactif} prof = {Props.prof} />
         </Box>
         }

    {isactif &&
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
           <DeactiveProf isactif = {isactif} setisactif = {setisactif} prof = {Props.prof} />
         </Box>
         }

    </div>
  );
}
