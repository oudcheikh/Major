import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { query, collection, getDocs, getDoc, where, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { DataGrid } from '@mui/x-data-grid';
import AssignCourseModal from "./assignecoursemodal"

const formattedDate = (d) => {
  let month = ("0" +(d.getMonth()+1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());

  return `${day}/${month}/${year}`;
};



const calculDistabce = (loc, locC) => {

  
  const lat1 = loc._lat;
  const lon1 = loc._long;
  const lat2 = locC._lat;
  const lon2 = locC._long;
  let dist;

  if ((lat1 == lat2) && (lon1 == lon2)) {
    dist = 0;
  } else {
    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radtheta = Math.PI * theta/180;
    dist = Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;
  }

  return dist;
};

const currencies = [
  {
    value: 'MRU',
    label: '฿',
  },
];

export default function ProfDispo() {
  
  
  const [user, loading, error] = useAuthState(auth);
  const [currency, setCurrency] = React.useState('EUR');
  const [value, setValue] = React.useState();
  const [name, setName] = useState("");
  const [clients, setClient ] = useState([]);
  const [cours, setCours] = React.useState([]);
  const [allclients, setAlltClient ] = useState([])
  const [allclientssecond, setAlltClientsecond] = useState([])
  const navigate = useNavigate();

  const { state } = useLocation();
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };


  
// booking_date: {seconds: 1640364222, nanoseconds: 467339000}
// client_uid: "kpNJZv4rGrcw6j4yqOX5iVIEIV52"
// course: "Lycée - Sciences Naturelles"
// date: {seconds: 1641040200, nanoseconds: 0}
// duration: "1"
// kid: "Aghlahoum"
// noted: false
// price: 320
// prof: ""
// prof_number: ""
// prof_uid: ""
// statut: 0
// .collection("Users").where("courses", "array-contains", "Collège - Mathématique")
// statut_date: {seconds: 0, nanoseconds: 0}
// userType: 1



const FindProf = async () =>{


    const clientProfile  = doc(db, "Users", state.state.data.client_uid);
    const clientProfileSnap = await getDoc(clientProfile );

    const myallClients = [];
    const myallClientssecode = [];


    const q = query(collection(db, "Users"), 
                              where("userType", "==", 2),
                              where("courses", "array-contains", state.state.data.course)
                              );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {

      querySnapshot.forEach((doc) => {
        myallClients.push(doc.data());
        
        const element = doc.data()
        
        element["uid"] = doc.id
        const distance = calculDistabce(element.location, clientProfileSnap.data().location)
        element["distance"] = distance

        
        
        setAlltClientsecond(allclientssecond => [...allclientssecond, element]);

      }
      );
      

    }
   
    )
  
    
  };


  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
 
    FindProf();
  }, [user, loading]);

  const columns = [
    { field: 'firstname', headerName: 'First name', width: 130 },
    { field: 'lastname', headerName: 'lastname', width: 130 },
    { field: 'phone', headerName: 'phone', width: 130 },
    { field: 'notation', headerName: 'notation', width: 130 },
    { field: 'quartier', headerName: 'quartier', width: 130 },
    { field: 'credit', headerName: 'credit', width: 130 },
    { field: 'distance', headerName: 'distance en KM', width: 130 },
    
    {
      field: 'subscription_date',
      headerName: 'subscription_date',
      valueFormatter: (params) => formattedDate(params.value.toDate()) ,
          width: 200
    },
    {
      field: "id",
      headerName: 'prof',
      renderCell: (cellValues) => {
        return (
          // <Button
          //   variant="contained"
          //   color="primary">
          //   Assigner
          // </Button>
          <AssignCourseModal state = {cellValues} course = {state.state.data}/>
        );
      }
    }
  ];



  return (

<div>
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
     <Typography variant="h6" gutterBottom>
     List prof filtre
      </Typography>
      

    </Box>
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={allclientssecond}
        getRowId={(row) => row.phone}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
    </Box>
   
    
    </div>
  );
}
