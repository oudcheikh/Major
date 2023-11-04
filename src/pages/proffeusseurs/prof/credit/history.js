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


const raisontxt = (raison) => {

  if (raison == 1) {
    return "Crédit de recharge contre argent du Professeur";
  }
  if (raison == 2)
  {
    return "Geste de bienvenue pour professeur"
  }
  if (raison == 3  )
  {
    return "Remboursement après promotion pour le client"
  }
  if (raison == 4)
  {
    return "Crédit donné par Major aux professeurs pour cadeau ou motivation"
  }
  if (raison == 5)
  {
    return "Dédommagement exptionnel" 
  }
  if (raison == 6)
  {
    return "Retrait de frais pour cours assuré"
  }

  if (raison == 7)
  {
    return "Récupération du crédit par le professeur"
  }
  else{
    return " "
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


export default function CreditHistory(Props) {
    
  const [credits, setCredit] = React.useState([]);
  const [allpendingcredits, setSllpendingcredits] = useState([])
  const [profile, setProfile] = React.useState({});
  
  const fetchAllClient = async () => {

    const Credit = [];
    const querySnapshotCredit = collection(db, "Users", Props.prof, "Credit")
    onSnapshot(querySnapshotCredit, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Credit.push(doc.data())
      });
      setCredit(orderByCreatedAt(Credit))
    });


    const prof_uid = Props.prof;
    const profProfile = doc(db, "Users", prof_uid);
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

  console.log("----------------------- credits : ", credits)
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
<Typography variant="h5" color="text.secondary">
    Credit :  {profile.credit} MRU
            </Typography>
        </Box>

    
   

{credits.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Valeur Ajouter  : {item.added_value}  |    Date : {formattedDate(item.created_at.toDate())} </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Operation : {item.operation}
          </Typography>

          {item.by == "Admin" &&
      <Typography>
      User  : {item.email}
    </Typography>
      }
          
          <Typography>
            Faite par  : {item.by}
          </Typography>

          <Typography>
            Raison  : {raisontxt(item.raison)}
          </Typography>

        </AccordionDetails>
      </Accordion>
      )}
    </div>
  );
}
