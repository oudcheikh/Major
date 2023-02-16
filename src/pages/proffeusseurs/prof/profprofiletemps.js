
import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import DesactiverModal from "./desactiverOffre"
import ActiverOffreModal from "./offres/activerOffre";
import { query, collection, getDocs, getDoc, where, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";


export default function ProfProfile(Props) {

  const { state } = useLocation();
  const [user, loading, error] = useAuthState(auth);
  const [value, setValue] = React.useState('1');
  const [ratings, setRatings] = React.useState([]);
  const [credit, setCredit] = React.useState([]);
  const [cours, setCours] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [uid, setUid] = React.useState("");
  const [switchstate, setswitchstate] = React.useState(state.data.isAgreed);

  const handleChange = (event) => {
    setswitchstate({
      ...switchstate,
      [event.target.name]: event.target.checked,
    });
  };
  const navigate = useNavigate();

  const handleswitchChange = (event, newValue) => {
    
    setValue(newValue);
  };

  const fetchAllClient = async () => {



    const profProfile = doc(db, "Users", state.uid);
    const profProfileSnap = await getDoc(profProfile);


    const Cours = [];
    const querySnapshotCourse = collection(db, "Users", state.uid, "Courses")
    onSnapshot(querySnapshotCourse, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log("Courses: ", doc.data());
        Cours.push(doc.data())
      });
      setCours(Cours)
    });

    const Credit = [];
    const querySnapshotCredit = collection(db, "Users", state.uid, "Credit")
    onSnapshot(querySnapshotCredit, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Credit.push(doc.data())
      });
      setCredit(Credit)
    });

    const Ratings = [];
    const querySnapshotRatings = collection(db, "Users", state.uid, "Credit")
    onSnapshot(querySnapshotRatings, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Ratings.push(doc.data())

      });
      setRatings(Ratings)
    });


    if (profProfileSnap.exists()) {
      
      setProfile(profProfileSnap.data())
    } else {
      // doc.data() will be undefined in this case
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchAllClient();
    setUid(state.uid)
  }, []);




  const [expanded, setExpanded] = React.useState(false);

  const handleChangeActivity = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

// "/profProfile/credit"

const goToCredit = () => {
  navigate("/profProfile/credit",
    {
     state: {  uid },
    }
    );
};

  return (

    <div>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        <Card sx={{ maxWidth: 345 }} style={{ alignSelf: 'center' }} >
          {/* <Avatar alt="Travis Howard" style={{ alignSelf: 'center' }} /> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Nom : {state.data.lastname}
            </Typography>

            <Typography gutterBottom variant="h5" component="div">
              Prenon : {state.data.firstname}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Phone : {state.data.phone}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Credit : {state.data.credit} MRU
            </Typography>
            <Typography variant="h5" color="text.secondary">
              Notation : {state.data.notation}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        
          {/* <Avatar alt="Travis Howard" style={{ alignSelf: 'center' }} /> */}
          {/* <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Activer ou desactiver le prof</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch checked={switchstate} onChange={handleswitchChange} />
                  }
                  label="Active"
                />
              </FormGroup>
              <FormHelperText>Faite Attention</FormHelperText>
          </FormControl> */}
      </Box>
      <div>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Activité" value="1" />
                <Tab label="Credit" value="2" />
                <Tab label="Offres_Validés" value="3" />
                <Tab label="Offres_Non_Validés" value="4" />
                {/* <Tab label="Valider le Prof" value="5" /> */}
              </TabList>
            </Box>
            <TabPanel value="1">
              {cours.map((item, index) => <Accordion expanded={expanded === 'panel4'} onChange={handleChangeActivity('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header">
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Cours : {item.course}</Typography>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>Status : {item.statut}</Typography>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}><Link href="#">Cours detaille</Link></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Date : {Date(item.date)}
                  </Typography>
                  <Typography>
                    Duration  :  {item.duration}
                  </Typography>
                  <Typography>
                    Price : {item.price}
                  </Typography>
                </AccordionDetails>
              </Accordion>)}
            </TabPanel>
            <TabPanel value="2">
              <Button onClick={goToCredit}> Update Credit </Button>
              {credit.map((item, index) => <Accordion expanded={expanded === 'panel4'} onChange={handleChangeActivity('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header">
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>old_credit : {item.old_credit}</Typography>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>added_value : {item.added_value}</Typography>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>by : {item.by}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    operation : {item.operation}
                  </Typography>
                </AccordionDetails>
              </Accordion>)}
            </TabPanel>
            
            <TabPanel value="3">
              {state.data.courses.map((item) => <Accordion expanded={expanded === 'panel4'} onChange={handleChangeActivity('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header">
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>{item}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <DesactiverModal prof = {state} coursToBeDesactivated = {item}
                  />
                </AccordionDetails>
              </Accordion>)}
            </TabPanel>

            <TabPanel value="4">
              {state.data.coursesToValidate.map((item) => <Accordion expanded={expanded === 'panel4'} onChange={handleChangeActivity('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>{item}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ActiverOffreModal prof = {state} coursToBeActivated = {item}/>
                </AccordionDetails>
              </Accordion>)}
            </TabPanel>

            {/* <TabPanel value="5">
            <Link href="#">Parametrage</Link>
            </TabPanel> */}

          </TabContext>
        </Box>
      </div>
    </div>
  );
}








