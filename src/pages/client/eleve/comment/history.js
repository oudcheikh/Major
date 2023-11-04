import React, { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { auth, db } from "../../../../firebase";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';


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
  const hour = ("0" + d.getHours()).slice(-2);
  const minutes = ("0" + d.getMinutes()).slice(-2);

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};


export default function CommenttHistory(Props) {
    
  const [Comments, setComment] = React.useState([]);
  const [allpendingComments, setSllpendingComments] = useState([])
  const [profile, setProfile] = React.useState({});
  
  const fetchAllClient = async () => {

  

    const Comment = [];
    const querySnapshotComment = collection(db, "Users", Props.client, "Comments")
    onSnapshot(querySnapshotComment, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Comment.push(doc.data())
      });
      setComment(orderByCreatedAt(Comment))
    });


    const client_uid = Props.client;
    const profProfile = doc(db, "Users", client_uid);
    const profProfileSnap = await getDoc(profProfile);

    if (profProfileSnap.exists()) {
      console.log("``");
      setProfile(profProfileSnap.data())
    } else {
      console.log("``");
    }
  
  
  };

  useEffect(() => {
    fetchAllClient();
    
  }, []);

  
  return (
    <div>

<Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>

        </Box>

    
   

{Comments.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Date : {formattedDate(item.created_at.toDate())} </Typography>
        </AccordionSummary>
        <AccordionDetails>
        
      <Typography>
      User  : {item.email}
    </Typography>
      
          
  

          <Typography>
            Comment  : {item.comment}
          </Typography>

        </AccordionDetails>
      </Accordion>
      )}
    </div>
  );
}
