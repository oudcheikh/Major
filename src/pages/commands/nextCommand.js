import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc, onSnapshot, collectionGroup , orderBy, Timestamp } from "firebase/firestore";
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function getStartOfToday() {
  const now = new Date()
  now.setUTCHours(5) // +5 hours for Eastern Time
  const timestamp = Timestamp.fromDate(now)
  return timestamp // ex. 1631246400
}

const formattedDate = (d) => {

  let month = ("0" +(d.getMonth()+1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());

  return `${day}/${month}/${year}`;
};

export default function NextCommand(Props) {

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [clients, setClient] = useState([])
  const [allpendingcourses, setSllpendingcourses] = useState([])
  const navigate = useNavigate();

  const fetchAllClient = async () => {""


    const timeObj = Timestamp.fromDate(new Date());
    const allCourses = [];
    const courses = await query(collectionGroup(db, 'Courses'), 
                          where('statut', '!=', -3), 
                          where('date', '<', getStartOfToday()) );
    const querySnapshot = await getDocs(courses);

    querySnapshot.forEach((doc) => {

      allCourses.push(doc.data());
      const element = doc.data()
      setSllpendingcourses(allCourses => [...allCourses, element]);

    });
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchAllClient();
  }, [user, loading]);





  return (



    <div>

      {Props.cours.map((item) => <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> {item.course} | Status : {item.statut}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          duration : {item.duration}
          </Typography>
          <Typography>
          price : {item.price}
          </Typography>
          <Typography>
          duration : {item.duration}
          </Typography>
          <Typography>
          duration : {item.duration}
          </Typography>
        </AccordionDetails>
      </Accordion>
      )}



    </div>
  );
}
