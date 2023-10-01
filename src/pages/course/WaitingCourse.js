
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, getDocs, where, getDoc, doc, collectionGroup, onSnapshot, collection, orderBy, Timestamp } from "firebase/firestore";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../features/counter/counterSlice'
import Button from '@mui/material/Button';



function orderByCreatedAt(arr) {
  return arr.sort((a, b) => {
    return a.booking_date
      <
      b.booking_date
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



const course_type = [{course_type: "individuel à domicile", index:1}, 
                      {course_type: "package à domicile", index:2}, 
                      {course_type:"individuel à distance", index:3}, 
                      {course_type:"package à distance", index:4},
                      {course_type:"chez Major", index:5}]


const formatCourUserType = (status) => {

  if (status == 1) {
    return "Parent d'élève";
  }
  if (status == 3) {
    return "Élève-étudiant"
  }
};

const formatCoursStatus = (status) => {
  if (status == 0) {
    return "Nouveau cours";
  }
  if (status == 1) {
    return "🚣 Cours confirmé par le professeur 🚣 "
  }
  if (status == 2) {
    return "🚣 👌 Cours terminé  🚣 👌 "
  }
  if (status == -1) {
    return "🙌 Cours annulé par le parent ou l'élève 🙌"
  }
  if (status == -2) {
    return "🚩 👎 Cours annulé par le professeur 🚩 👎"
  }
  if (status == -3) {
    return "🚩 🤫 Professeur absent 🚩 🤫"
  }

  if (status == -4) {
    return "🚩 🚩 🚩l'admin annule le cours comfirmé"
  }

};


export default function WaitingCourse() {


  const count = useSelector((state) => state.pendingCours.value)
  const dispatch = useDispatch()

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [clients, setClient] = useState([])
  const [allpendingcourses, setSllpendingcourses] = useState([])
  const [mycourses, setMycourses] = useState([])
  const navigate = useNavigate();

  const fetchAllClient = async () => {


    const timeObj = Timestamp.fromDate(new Date());
    const allCourses = [];


    const courses = await query(collectionGroup(db, 'Courses'), where('statut', '==', 0),
      where('userType', 'in', [1, 3])
      , where('date', '>', timeObj));


    const querySnapshot = await getDocs(courses);
    // setMycourses(allCourses)
    let id = 0;
    querySnapshot.forEach((doc) => {

      const element = doc.data()
      element.course_uid = doc.id;
      allCourses.push(element);
      id = id + 1;
      element["id"] = id;
      setSllpendingcourses(allCourses => [...allCourses, element]);

    });
    setMycourses(orderByCreatedAt(allCourses))
  };

  const getRole = async () => {

    const profProfile = doc(db, "Admin", user["uid"]);
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

  const courStatus = { 1: "Parent d'élève", 3: "Élève-étudiant" }

  const columns = [


    // booking_date
    {
      field: 'booking_date', headerName: 'booking_date',
      valueFormatter: (params) => formattedDate(params.value.toDate()),
      width: 180
    },
    { field: 'course', headerName: 'course', width: 180 },
    { field: 'duration', headerName: 'Duré', width: 80 },
    {
      field: 'from', 
      headerName: 'Crée par admin', 
      width: 130,
      valueGetter: (params) => params.row.from == "website" ? "Oui" : "Non"
    },
    { field: 'type', headerName: 'type_cours', width: 200, 
      valueFormatter: (params) => course_type.find(element => element.index === params.value).course_type,
    },

    
    {
      field: 'statut', headerName: 'statut', width: 180,

      valueFormatter: (params) => formatCoursStatus(params.value),
    },

    { field: 'classroom', headerName: 'classroom', width: 300 }, //classroom

    {
      field: 'userType', headerName: 'userType', width: 130,
      valueFormatter: (params) => formatCourUserType(params.value)
    },
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


  console.log("yyyyyyyyyyyy ----------------- all my course : ", mycourses)

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

