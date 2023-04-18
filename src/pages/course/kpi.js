import React, { useEffect, useState } from "react";
import { LineChart, Line } from "recharts";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { query, getDocs, where, getDoc, doc,collectionGroup ,onSnapshot,collection, orderBy, Timestamp} from "firebase/firestore";
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Grid from '@mui/material/Grid';

const data = [
  {
    "coursAnnuleClient": 0,
    "coursNoteParent": 0,
    "coursNoteProf": 0,
    "coursAnnuleAdmin": 0,
    "coursNoteEleve": 0,
    "eleveInscrit": 0,
    "parentInscrit": 0,
    "ProfActif": 166,
    "date": {
        "seconds": 1677110400,
        "nanoseconds": 0
    },
    "coursTermine": 0,
    "coursAssign": 0,
    "coursProfAbsent": 0,
    "coursNonTermine": 0,
    "coursAnnuleProfCritique": 0,
    "coursSansProf": 0,
    "ProfInscrit": 2,
    "coursPris": 0,
    "coursAnnuleProfTotal": 0,
    "uid": "2023_02_23"
  },
  {
    "coursSansProf": 0,
    "coursNoteProf": 0,
    "coursTermine": 0,
    "ProfActif": 166,
    "coursAnnuleProfCritique": 0,
    "coursNoteParent": 0,
    "coursAnnuleProfTotal": 0,
    "ProfInscrit": 1,
    "coursAnnuleClient": 0,
    "coursNoteEleve": 0,
    "coursPris": 0,
    "coursAnnuleAdmin": 0,
    "coursAssign": 0,
    "coursProfAbsent": 0,
    "parentInscrit": 0,
    "eleveInscrit": 0,
    "date": {
        "seconds": 1677196800,
        "nanoseconds": 0
    },
    "coursNonTermine": 0,
    "uid": "2023_02_24"
  }
];

const Chart = () => {

    const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [clients, setClient] = useState([])
  const [allclients, setAlltClient] = useState([])
  const [allclientssecond, setAlltClientsecond] = useState([])
  let [allprofs, setAllprofs] = useState([])
 

  



  const fetchAllClient = async () => {

    const myallClients = [];
    const myallClientssecode = [];

    const q = query(collection(db, "KPI"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {

      querySnapshot.forEach((doc) => {
        myallClients.push(doc.data());
        const element = doc.data();
        element["uid"] = doc.id;
        setAlltClientsecond(allclientssecond => [...allclientssecond, element]);
      }
      );
      setAlltClient(myallClientssecode)
      

    })
  };

  useEffect(() => {

    // getRole();
    // if (loading) return;
    // if (!user) return navigate("/");

    fetchAllClient();
  }, []);

  console.log("_______________________ kpi : ", allclientssecond)

  return (
    // <LineChart width={600} height={300} data={data}>
    //   <XAxis dataKey="uid" />
    //   <YAxis />
    //   <CartesianGrid strokeDasharray="3 3" />
    //   <Tooltip />
    //   <Legend />
    //   <Line type="monotone" dataKey="ProfInscrit" stroke="#8884d8" activeDot={{ r: 8 }} />
    // </LineChart>

    <div>
    <Grid sx={12}> 
        <BarChart
          width={1500}
          height={500}
          data={allclientssecond}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="uid" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ProfInscrit" fill="#8884d8" />
          <Bar dataKey="parentInscrit" fill="#82ca9d" />
          <Bar dataKey="eleveInscrit" fill="#82ca9e" />
        </BarChart>
        </Grid>

<Grid sx={12}> 
<BarChart
  width={1500}
  height={500}
  data={allclientssecond}
  margin={{
    top: 20,
    right: 30,
    left: 20,
    bottom: 5,
  }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="uid" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="coursTermine" fill="#8884d8" />
  <Bar dataKey="coursNoteProf" fill="#8562d8" />
  <Bar dataKey="coursNoteEleve" fill="#8511d1" />
  <Bar dataKey="coursNoteParent" fill="#8252d3" />
  <Bar dataKey="coursAssign" fill="#82ca9d" />
  <Bar dataKey="coursProfAbsent" fill="#82ca6c" />
  <Bar dataKey="coursNonTermine" fill="#82ca9g" />
  <Bar dataKey="coursAnnuleProfCritique" fill="#32ca5d" />
  <Bar dataKey="coursSansProf" fill="#85ca9d" />
  <Bar dataKey="coursPris" fill="#783627" />
  <Bar dataKey="coursAnnuleClient" fill="#384627" />
  <Bar dataKey="coursAnnuleAdmin" fill="#764614" />
  <Bar dataKey="coursAnnuleProfTotal" fill="#773614" />
  <Bar dataKey="coursAssign" fill="#785731" />


  "coursTermine": 0,
    "coursAssign": 0,
    "coursProfAbsent": 0,
    "coursNonTermine": 0,
    "coursAnnuleProfCritique": 0,
    "coursSansProf": 0,
    "ProfInscrit": 2,
    "coursPris": 0,

    "coursSansProf": 0,
    "coursNoteProf": 0,
    "coursTermine": 0,
    "ProfActif": 166,
    "coursAnnuleProfCritique": 0,
    "coursNoteParent": 0,
    "coursAnnuleProfTotal": 0,
    "ProfInscrit": 1,
    "coursAnnuleClient": 0,
    "coursNoteEleve": 0,
    "coursPris": 0,
    "coursAnnuleAdmin": 0,
    "coursAssign": 0,
    "coursProfAbsent": 0,
    "parentInscrit": 0,
    "eleveInscrit": 0,
    
    "coursNonTermine": 0,


</BarChart>
</Grid>
</div>
      
  );
};

export default Chart;
