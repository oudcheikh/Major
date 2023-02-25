import React, { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { auth, db } from "../../../../firebase";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";
import DesactiverModal from "./desactiverOffre"


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


export default function ActiveOffre(Props) {
    
  const [credits, setCredit] = React.useState([]);
  const [allpendingcredits, setSllpendingcredits] = useState([])
  const [profile, setProfile] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [profuid, setProfuid] = React.useState();
  
  const fetchAllClient = async () => {

   
    const prof_uid = Props.prof;
    const profProfile = doc(db, "Users", prof_uid);
    const profProfileSnap = await getDoc(profProfile);
    setProfuid(prof_uid);
    if (profProfileSnap.exists()) {
      
      setProfile(profProfileSnap.data())
    
      setCourses(profProfileSnap.data().courses)
    } else {
      console.log("``");
    }
  
  
  };

  useEffect(() => {
    fetchAllClient();
    
  }, []);


  
  return (
    <div>
{courses.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> {item} </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <DesactiverModal prof = {profuid} setCourses = {setCourses} coursToBeDesactivated = {item}/>
        </AccordionDetails>
      </Accordion>
      )} 
    </div>
  );
}
