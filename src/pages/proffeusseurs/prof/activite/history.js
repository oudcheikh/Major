import React, { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { auth, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";



function orderByCreatedAt(arr) {
  return arr.sort((a, b) => {
    return a.date
    <
     b.date
     ? 1 : -1;
  });
}

const formatCoursStatus = (status) => {
  if (status == 0) {
    return "Nouveau cours";
  }
  if (status == 1)
  {
    return "Cours confirmé par le professeur 🚣 "
  }
  if (status == 2)
  {
    return "Cours terminé  🚣 👌 "
  }
  if (status == -1)
  {
    return "Cours annulé par le parent ou l'élève 🙌"
  }
  if (status == -2)
  {
    return "Cours annulé par le professeur 🚩 👎"
  }
  if (status == -3)
  {
    return "Professeur absent 🚩 🤫"
  }

};


const formattedDate = (d) => {

  
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());
  const hour = String(d.getHours());
  const minutes = String(d.getMinutes());

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};


export default function CoursesHistory(Props) {
    
  const [activitis, setCourses] = React.useState([]);
  const [allpendingactivitis, setSllpendingactivitis] = useState([])
  const [user, loading, error] = useAuthState(auth);
  
  const fetchAllClient = async () => {


    const Courses = [];
    const querySnapshotCourses = collection(db, "Users", Props.prof, "Courses")
    onSnapshot(querySnapshotCourses, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Courses.push(doc.data())
      });
      setCourses(orderByCreatedAt(Courses))
    });
  
  
  };

  useEffect(() => {
    
    fetchAllClient();
    
  }, []);
 

  return (
    <div>

{activitis.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> date : {formattedDate(item.date.toDate())}  | booking_date :   {formattedDate(item.booking_date.toDate())}  | status : {formatCoursStatus(item.statut)} </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography>
           Coures : {item.course}
          </Typography>
          <Typography>
           date : {formattedDate(item.date.toDate())}
          </Typography>
          <Typography>
          duration : {item.duration}
          </Typography>
          <Typography>
          price : {item.price}
          </Typography>
          <Typography>
          eleve : {item.eleve}
          </Typography>

          <Typography>
          noted : {item.noted}
          </Typography>
        </AccordionDetails>
      </Accordion>
      )}
    </div>
  );
}
