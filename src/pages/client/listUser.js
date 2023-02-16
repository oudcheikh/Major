
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";

import Button from '@mui/material/Button';


const formattedDate = (d) => {

  let month = ("0" +(d.getMonth()+1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());

  return `${day}/${month}/${year}`;
};


export default function AllStudents() {

        const [user, loading, error] = useAuthState(auth);
        const [name, setName] = useState("");
        const [clients, setClient ] = useState([])
        const [allclients, setAlltClient ] = useState([])
        const navigate = useNavigate();

        const fetchAllClient = async () => {

        const myallClients  = [];
        const q = query(collection(db, "Users"),  where("userType", "!=", 2));
              const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  myallClients.push(doc.data());
                  const element = doc.data()
                  element["uid"] = doc.id
                  setAlltClient(myallClients => [...myallClients, element]);
                });
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

      
        const goToUser = (data, uid) => {
          if (data.userType == 3) {
          navigate("/user/profile/student",
            {
              state: {data, uid },
            }
            
            );
          }
            else {
              navigate("/user/profile/parent",
            {
              state: {data, uid },
            });
            }
        };

        const columns = [
  

          { field: 'firstname', headerName: 'First name', width: 130 },
          { field: 'lastname', headerName: 'lastname', width: 130 },
          { field: 'phone', headerName: 'phone', width: 130 },
          { field: 'userType', headerName: 'userType', width: 130 },
          { field: 'quartier', headerName: 'quartier', width: 130 },
          { field: 'subscription_date', headerName: 'subscription_date',
          
          valueFormatter: (params) => formattedDate(params.value.toDate()) ,
          width: 200 },
        
          {
           
            field: "id",
            headerName: 'user',
            renderCell: (cellValues) => {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => {
                   
                    goToUser(cellValues.row, cellValues.row.uid)
                  }}
                >
                  Detaille
                </Button>
              );
            }
          }
        ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={allclients}
        getRowId={(row) => row.firstname}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}


