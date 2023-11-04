import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { query, collection, getDocs, getDoc, where, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db, functions} from "../../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
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

  
  const lat1 = loc._latitude;
  const lon1 = loc._longitude;
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
  

  const searchProf = httpsCallable(functions, 'adminSearchProf');

  
  
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



const FindProf = async () =>{

    const clientProfile  = doc(db, "Users", state.state.data.client_uid);
    const clientProfileSnap = await getDoc(clientProfile );
    const myallClients = [];
    const myallClientssecode = [];
    const q = query(collection(db, "Users"), 
                              where("userType", "==", 2),
                              where("courses", "array-contains", state.state.data.course)
                              );
    let params = {}

    console.log("----------------------- state.state : ", state.state.data)

    // cours normale
  
    params = { courseKey: state.state.data.course_uid,  clientUid : state.state.data.client_uid}
    
    console.log("state.state.data.prix_totale_applicable : ", state.state.data.prix_totale_applicable)
    // package
    if (state.state.data.prix_totale_applicable){
      console.log(" in package  package ")
      params = { courseKey: state.state.data.uid,  
                clientUid : state.state.data.client_uid, 
                isPackage:true }
    }

    // cours package
    if (state.state.data.Package){


      console.log(" cours package ", state.state.data.course_uid)
      params = { courseKey: state.state.data.course_uid,     
                clientUid : state.state.data.client_uid, 
                isPackage:true,
                isPackageCourse:true
              }
    } 

    console.log("paramater : ", params)
    
    searchProf(params)
    .then((result) => {
      // Read result of the Cloud Function.
      /** @type {any} */
      const data = result.data;
      const sanitizedMessage = data.text;
      const profList = data.profList;
  
      profList.forEach(element => {
        myallClients.push(element);
        const distance = calculDistabce(element["location"], clientProfileSnap.data().location)
        element["distance"] = distance
        setAlltClientsecond(allclientssecond => [...allclientssecond, element]);
      });
    }
    );
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
      field: "uid",
      headerName: 'prof',
      renderCell: (cellValues) => {
        return (
          // <Button
          //   variant="contained"
          //   color="primary">
          //   Assigner
          // </Button>
          <AssignCourseModal state = {cellValues} course = {state.state}/>
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
