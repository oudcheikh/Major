import React, { useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../firebase";



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
    return "Nouveau cours 🙌";
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
    return "Cours annulé par le parent ou l'élève 🚩 🙌"
  }

  if (status == -2)
  {
    return "Cours annulé par le professeur 🚩 👎"
  }
  if (status == -3)
  {
    return "Professeur absent 🚩 🚩 🤫"
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


export default function CoursHistory(Props) {

  console.log("_______________________________ Props.client : ", Props)
  
  const [cours, setCours] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const navigate = useNavigate();

  const fetchAllClient = async () => {

    const Cours = [];
    const querySnapshotCourse = collection(db, "Users", Props.client, "Courses")
    onSnapshot(querySnapshotCourse, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
    
        Cours.push(doc.data())
      });
      setCours(orderByCreatedAt(Cours))
    });

  
  };

  useEffect(() => {
    fetchAllClient();
  }, []);



  return (



    <div>

      {cours.map((item) => 
      <Accordion>
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
