import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";

import Link from '@mui/material/Link'
import Button from '@mui/material/Button';

const formattedDate = (d) => {
  let month = ("0" +(d.getMonth()+1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());

  return `${day}/${month}/${year}`;
};

export default function ListProf() {

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [clients, setClient] = useState([])
  const [allclients, setAlltClient] = useState([])
  const [allclientssecond, setAlltClientsecond] = useState([])
  const navigate = useNavigate();

  const goToProfProfile = (phone, data, uid) => {
    navigate("/profProfile",
      {
        state: { phone, data, uid },
      });
  };

  const columns = [
    
    { field: 'firstname', headerName: 'First name', width: 130 },
    { field: 'lastname', headerName: 'lastname', width: 130 },
    { field: 'phone', headerName: 'phone', width: 130 },
    { field: 'notation', headerName: 'notation', width: 130 },
    { field: 'quartier', headerName: 'quartier', width: 130 },

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
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              goToProfProfile(cellValues.id, cellValues.row, cellValues.row.uid)
            }}
          >
            Detaille
          </Button>
        );
      }
    }
  ];




  const fetchAllClient = async () => {

    const myallClients = [];
    const myallClientssecode = [];

    const q = query(collection(db, "Users"), where("userType", "==", 2));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {

      querySnapshot.forEach((doc) => {
        myallClients.push(doc.data());
        const element = doc.data()
        element["uid"] = doc.id

        

        setAlltClientsecond(allclientssecond => [...allclientssecond, element]);

      }
      );
      

    })
  };
  
  const getRole = async ()=> {
    const profProfile = doc(db, "Admin",  user["uid"]);
    const profProfileSnap = await getDoc(profProfile);
    const myprofile = profProfileSnap.data();
    if (!myprofile) return navigate("/")
   
  }
  useEffect(() => {

    getRole();
    if (loading) return;
    if (!user) return navigate("/");

    fetchAllClient();
  }, [user, loading]);


  return (
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
  );
}

