
import React, { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ActiverOffreModal from "./activerOffre";
import { auth, db } from "../../../../firebase";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";



function orderByCreatedAt(arr) {
  return arr.sort((a, b) => {
    return a.created_at <
     b.created_at ? 1 : -1;
  });
}


const formattedDate = (d) => {

  
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());
  const hour = String(d.getHours());
  const minutes = String(d.getMinutes());

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};


export default function DesActiveOffre(Props) {
    
  const [credits, setCredit] = React.useState([]);
  const [allpendingcredits, setSllpendingcredits] = useState([])
  const [profile, setProfile] = React.useState({});
  const [coursesavalide, setCourses] = React.useState([]);
  const [profuid, setProfuid] = React.useState();
  
  const fetchAllClient = async () => {

   
    const prof_uid = Props.prof;
    const profProfile = doc(db, "Users", prof_uid);
    const profProfileSnap = await getDoc(profProfile);
    setProfuid(prof_uid);
    if (profProfileSnap.exists()) {
      console.log("`-------------------fffffffffffffffffffff----------------------------------`", profProfileSnap.data().coursesToValidate);
      setProfile(profProfileSnap.data())
      setCourses(profProfileSnap.data().coursesToValidate)
    } else {
      console.log("``");
    }
  
  
  };

  useEffect(() => {
    fetchAllClient();
    
  }, []);


  
    return (
    <div>
      {coursesavalide.map((item) => <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> {item} </Typography>
        </AccordionSummary>

        <AccordionDetails>
        <ActiverOffreModal prof = {profuid} 
        setCourses = {setCourses} coursToBeActivated = {item}/>
        </AccordionDetails>
      </Accordion>
      )}
    </div>
  );
}
