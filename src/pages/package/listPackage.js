import { DataGrid, GridToolbar  } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";
import Link from '@mui/material/Link';
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

const formatPackageStatus = (status) => {
  if (status == 0) {
    return " 🚣Nouveau Package";
  }
  if (status == 1)
  {
    return "🚣 🚣 Package pret  "
  }
  if (status == 2)
  {
    return "🚣 👌 Package comfirmé "
  }
  if (status == 3)
  {
    return "🚣 👌 👌 Package complet "
  }
  if (status == -1)
  {
    return "🚩 Package annulé par le professeur "
  }
  if (status == -2)
  {
    return "🚩 🚩 Package suspendu par le professor "
  }

  if (status == -3)
  {
    return "🚩 👎 Package annulé par le client"
  }
  if (status == -4)
  {
    return "Package no signé par le client"
  }
  if (status == -5)
  {
    return "🚩 annulé Package par l'admin"
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

export default function AllPackages() {

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
    const myCollectionRef = collection(db, "Packages");


    const qd = query(myCollectionRef, orderBy("booking_date","desc"));
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


  const goToPackage = (data, uid) => {
   
    navigate("/user/package",
      {
        state: {data, uid },
      }
      );
    
  };

  const columns = [
 { field: "booking_date",headerName: 'booking_date', valueFormatter: (params) => formattedDate(params.value.toDate()) ,
 width: 200 } ,
 { field:  "classroom", headerName:  "classroom", width: 130 } ,
{ field: "client_nom",headerName:"client_nom", width: 130 },
{ field: "client_number",headerName:"client_number", width: 130 },
{ field: "numHour",headerName:"numHour", width: 130 },
 { field: "numPackage",headerName:"numPackage", width: 130 },
 { field: 'statut', headerName: 'statut', width: 330,
    valueFormatter: (params) => formatPackageStatus(params.value),
     },
    {
      field: "id",
      headerName: 'id',
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              goToPackage(cellValues.row, cellValues.row.uid)
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
      <br></br>
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

