import Grid from '@mui/material/Grid';
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
import { auth, db } from "../../firebase";


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

    // const q = query(collection(db, "KPI"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {

    //   querySnapshot.forEach((doc) => {
    //     myallClients.push(doc.data());
    //     const element = doc.data();
    //     element["uid"] = doc.id;
    //     setAlltClientsecond(allclientssecond => [...allclientssecond, element]);
    //   }
    //   );
    //   setAlltClient(myallClientssecode)
    // })

    const myCollectionRef = collection(db, "KPI");


    const qd = query(myCollectionRef);
    const querySnapshot = await getDocs(qd);
    querySnapshot.forEach((doc) => {
      const element = doc.data();
      element["uid"] = doc.id;
      myallClients.push(element); 
     
    });
    setAlltClient(myallClients)
    console.log("_______________________ myallClients : ", myallClients)


  };

  useEffect(() => {

    // getRole();
    // if (loading) return;
    // if (!user) return navigate("/");

    fetchAllClient();
  }, []);

  // console.log("_______________________ kpi : ", allclientssecond)

  return (


    <div>
    <Grid sx={6}> 
        <ComposedChart
          width={1500}
          height={600}
          data={allclients}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="uid"  />
          <YAxis />
          <Tooltip />
          <Legend />
          
          <Bar dataKey="ProfInscrit" fill="#8884d8" />
          <Bar dataKey="parentInscrit" fill="#82ca9d" />
          <Bar dataKey="eleveInscrit" fill="#82ca9e" />
          <Line type="monotone" dataKey="eleveInscrit" stroke="#ff7300" />
          <Line type="monotone" dataKey="ProfInscrit" stroke="#8884d8" />
        </ComposedChart>
        </Grid>


<Grid sx={6}> 

<ComposedChart
          width={1500}
          height={600}
          data={allclients}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="uid"  />
          <YAxis />
          <Tooltip />
          <Legend />
          
          <Bar dataKey="coursProfAbsent" fill="#82ca6c" />
  <Bar dataKey="coursNonTermine" fill="#82ca9g" />
  <Bar dataKey="coursAnnuleProfCritique" fill="#32ca5d" />
  <Bar dataKey="coursSansProf" fill="#85ca9d" />
  <Bar dataKey="coursAnnuleClient" fill="#384627" />
  <Bar dataKey="coursAnnuleAdmin" fill="#764614" />
  <Bar dataKey="coursAnnuleProfTotal" fill="#773614" />
          <Line type="monotone" dataKey="coursAnnuleClient" stroke="#ff7300" />
        </ComposedChart>





</Grid>

<Grid sx={6}>
<ComposedChart
          width={1500}
          height={600}
          data={allclients}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="uid"  />
          <YAxis />
          <Tooltip />
          <Legend />
          
          <Bar dataKey="coursAssign" barSize={20} fill="#82ca9d" />
          <Bar dataKey="coursPris" barSize={20} fill="#783627" />
          <Bar dataKey="coursTermine" barSize={20} fill="#8884d8" />
          <Line type="monotone" dataKey="coursPris" stroke="#ff7300" />
          <Line type="monotone" dataKey="coursTermine" stroke="#8884d8" />
        </ComposedChart>
        </Grid>
        <Grid sx={6}> 
<BarChart
  width={1500}
  height={500}
  data={allclients}
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
  <Bar dataKey="coursNoteProf" fill="#8562d8" />
  <Bar dataKey="coursNoteEleve" fill="#8511d1" />
  <Bar dataKey="coursNoteParent" fill="#8252d3" />
</BarChart>

</Grid>
</div>
      
  );
};

export default Chart;
