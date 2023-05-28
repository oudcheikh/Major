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
  const hour = ("0" + d.getHours()).slice(-2);
  const minutes = ("0" + d.getMinutes()).slice(-2);

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};


export default function NotationHistory(Props) {

  const [Notifications, setNotifications] = React.useState([]);
  const [allpendingNotifications, setSllpendingNotifications] = useState([])
  
  
  const fetchAllClient = async () => {


    

    const Notifications = [];
    const querySnapshotNotifications = collection(db, "Users", Props.prof, "Ratings")
    onSnapshot(querySnapshotNotifications, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Notifications.push(doc.data())
      });
      setNotifications(orderByCreatedAt(Notifications))
    });
  
  
  };

  useEffect(() => {
    

    fetchAllClient();
    
  }, []);

  
  return (
    <div>

{Notifications.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
           <Typography>notation : {item.notation}   |    Date : {formattedDate(item.date.toDate())}</Typography>
          {/* <Typography>Valeur Ajouter : {item.}   |    course_date : {formattedDate(item.course_date.toDate())} </Typography> */}
        </AccordionSummary>
       <AccordionDetails>
          <Typography>
            oldNot : {item.oldNbNot}
          </Typography>

          <Typography>
            oldNotation  : {item.oldNotation}
          </Typography>
          <Typography>
            Donné par  : {item.by}
          </Typography>
          <Typography>
          num_client  : {item.num_client ? item.num_client : " "} 
          </Typography>
          <Typography>
          remarque : {item.remarque}   
          </Typography>
          <Typography>
          course_date  : {formattedDate(item.course_date.toDate())}
          </Typography>
        </AccordionDetails> 
      </Accordion>
      )}
    </div>
  );
}
