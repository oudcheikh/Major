
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../features/counter/counterSlice'
import Button from '@mui/material/Button';



function orderByCreatedAt(arr) {
  return arr.sort((a, b) => {
    return a.date
    <
     b.date
     ? 1 : -1;
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

const formatCourUserType = (userType) => {



  if (userType == 1) {
    return "Parent d'élève";
  }
  if (userType == 3)
  {
    return "Élève-étudiant"
  }
};

const formatCoursStatus = (status) => {
  if (status == 0) {
    return "Nouveau cours";
  }
  if (status == 1)
  {
    return "🚣 Cours confirmé par le professeur 🚣 "
  }
  if (status == 2)
  {
    return "🚣 👌 Cours terminé  🚣 👌 "
  }
  if (status == -1)
  {
    return "🙌 Cours annulé par le parent ou l'élève 🙌"
  }
  if (status == -2)
  {
    return "🚩 👎 Cours annulé par le professeur 🚩 👎"
  }
  if (status == -3)
  {
    return "🚩 🤫 Professeur absent 🚩 🤫"
  }

  if (status == -4)
  {
    return "🚩 🚩 🚩l'admin annule le cours comfirmé"
  }

};


export default function AnciensCours() {


  const count = useSelector((state) => state.pendingCours.value)
  const dispatch = useDispatch()

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [clients, setClient] = useState([])
  const [allpendingcourses, setSllpendingcourses] = useState([])
  const [mycourses, setMycourses] = useState([])
  const navigate = useNavigate();

  const fetchAllClient = async () => {


    // set tomorrow's date
    // const tomorrow = new Date(today);
    // tomorrow.setDate(tomorrow.getDate() - 3);
    // const avant = Timestamp.fromDate(tomorrow);




    const timeObj = Timestamp.fromDate(new Date());

    let currentDate = new Date(); // Création d'un objet Date pour la date actuelle
currentDate.setDate(currentDate.getDate() - 5); // Définition de la date à trois jours avant la date actuelle
let avanthier = Timestamp.fromDate(currentDate); // Création d'un Timestamp Firebase à partir de cette date

    const allCourses = [];
    const courses = await query(collectionGroup(db, 'Courses'), where('statut', '==' ,1),
    where('userType', 'in', [1, 3])
    , where('date', '<', timeObj )
    , where('date', '>', avanthier ) );
    const querySnapshot = await getDocs(courses);
    // setMycourses(allCourses)
    let id = 0;
    querySnapshot.forEach((doc) => {

      const element = doc.data()
      element.course_uid = doc.id ;
      allCourses.push(element);
      id = id + 1;
      element["id"] = id;
      setSllpendingcourses(allCourses => [...allCourses, element]);

    });
   
    setMycourses(orderByCreatedAt(allCourses))
  };

  const getRole = async ()=> {

    const profProfile = doc(db, "Admin",  user["uid"]);
    const profProfileSnap = await getDoc(profProfile);
    const myprofile = profProfileSnap.data();
    if (!myprofile) return navigate("/")
   
  }

  useEffect(() => {
    getRole()
    if (loading) return;
    if (!user) return navigate("/");
    fetchAllClient();
    setSllpendingcourses(allpendingcourses)
  }, [user, loading]);


  const goToCourse = (data, uid) => {
      navigate(/* It's a route. */
      "/user/profile/course",
        {
          state: { data, uid },
        });

    
  };



  const columns = [


    // booking_date
    { field: 'booking_date', headerName: 'booking_date',
    valueFormatter: (params) => formattedDate(params.value.toDate()),
    width: 180 },
    { field: 'course', headerName: 'course', width: 180 },
    { field: 'duration', headerName: 'Duré', width: 130 },
    { field: 'statut', headerName: 'statut', width: 330, 
    
    valueFormatter: (params) => formatCoursStatus(params.value),
     },
    { field: 'userType', headerName: 'userType', width: 130,
    valueFormatter: (params) => formatCourUserType(params.value) },
    {
      field: 'date', headerName: 'date',

      valueFormatter: (params) => formattedDate(params.value.toDate()),
      width: 200
    },

    {

      field: "id",
      headerName: 'duration',
      width: 300,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {

              goToCourse(cellValues.row)
            }}
          >
            Go To Course
          </Button>
        );
      }
    }



  ];


  return (
    <div style={{ height: 1000, width: '100%' }}>
      <DataGrid
        rows={mycourses}
        getRowId={(row) => row.course_uid}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]} 
      />
    </div>
  );
}

