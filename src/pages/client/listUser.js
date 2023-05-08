import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";
import Link from '@mui/material/Link'
import Button from '@mui/material/Button';




const formatCourUserType = (userType) => {


  if (userType == 1) {
    return "Parent d'élève";
  }
  if (userType == 3)
  {
    return "Élève-étudiant"
  }
};


function orderByCreatedAt(arr) {
  return arr.sort((a, b) => {
    return a.subscription_date
    <
     b.subscription_date
     ? 1 : -1;
  });
}

const formattedDate = (d) => {

  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());
  const hour = ("0" + d.getHours()).slice(-2) // ("0" + d.getHours()).slice(-2)   ;
  const minutes = ("0" + d.getMinutes()).slice(-2);

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};

export default function AllStudents() {

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [clients, setClient] = useState([])
  const [allclients, setAlltClient] = useState([])
  const [allclientssecond, setAlltClientsecond] = useState([])
  let [allprofs, setAllprofs] = useState([])
  const navigate = useNavigate();

  const goToProfProfile = (phone, data, uid) => {
    navigate("/profProfile",
      {
        state: { phone, data, uid },
      });
  };



  const fetchAllClient = async () => {

    const myallClients = [];
    const myallClientssecode = [];
    const myCollectionRef = collection(db, "Users");


const qd = query(myCollectionRef, where("userType", "in", [1,3]), orderBy("subscription_date","desc"));


const querySnapshot = await getDocs(qd);


querySnapshot.forEach((doc) => {

  const element = doc.data();
  element["uid"] = doc.id;
  myallClients.push(element);
  
});


setAlltClient(myallClients)

  
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
  }, []);


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
    <div style={{ height: 650, width: '100%' }}>
      <DataGrid
        rows={allclients}
        getRowId={(row) => row.uid}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[20]}
        checkboxSelection
      />
    </div>
  );
}

