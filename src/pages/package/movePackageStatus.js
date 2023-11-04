import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, functions } from "../../firebase";
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import de from 'date-fns/locale/de';
import enGB from 'date-fns/locale/en-GB';
import zhCN from 'date-fns/locale/zh-CN';
import { httpsCallable } from "firebase/functions";
import Autocomplete from '@mui/material/Autocomplete';

dayjs.extend(advancedFormat);



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  '@media (max-width: 600px)': {
    width: '80%',
  },
  '@media (min-width: 601px) and (max-width: 960px)': {
    width: '60%',
  },
  '@media (min-width: 961px) and (max-width: 1280px)': {
    width: '50%',
  },
  '@media (min-width: 1281px)': {
    width: 400,
  },
};


let AllPackageStatus = [
  
  {status :"Package pret", index : 1 },
  {status :"Package comfirmé", index : 2},
  {status :"Package complet", index : 3},
  {status :"Package annulé par le professeur", index : -1},
  {status :"Package suspendu par le professor", index : -2},
  {status :"Package annulé par le client", index : -3},
  {status :"Package no signé par le client", index : -4 },
  {status :"annulé Package par l'admin", index : -5}
];

function myPackageStatus(index) {
  let result = [];
    for(let packageStatus of AllPackageStatus) {
        // On ajoute le statut au tableau de résultats s'il est supérieur ou égal à l'index fourni
        // et s'il est différent de "Nouveau Package".
        if( packageStatus.index != index) {
            result.push(packageStatus.status);
        }
    }
    return result;
}

const formatPackageStatus = (status) => {
  if (status == "Nouveau Package") {
    return 0;
  }
  if (status == "Package pret") {
    return 1
  }
  if (status == "Package comfirmé") {
    return 2
  }
  if (status == "Package complet") {
    return 3
  }
  if (status == -1) {
    return "Package annulé par le professeur"
  }
  if (status == "Package suspendu par le professor") {
    return -2
  }

  if (status == "Package annulé par le client") {
    return -3
  }
  if (status == "Package no signé par le client") {
    return -4
  }
  if (status == "annulé Package par l'admin") {
    return -5
  }
};





export default function MoveStatus(Props) {


  const [locale, setLocale] = React.useState('en-us');

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [offre, setoffre] = React.useState([]);
  const [nclient, setnclient] = React.useState('');
  const [price, setprice] = React.useState('');
  const [cours, setcours] = React.useState();
  const [serie, setserie] = React.useState('');
  const [valueDateTile, setValue] = React.useState(new Date());
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  let [isDisabled, setIsDisabled] = React.useState(false);
  const [valuen, setValuen] = React.useState(1);
  const [coursType, setcourType] = React.useState("Cours individuel à domicile");

  const adminMovePackageStatut = httpsCallable(functions, 'adminMovePackageStatut');

  

  

  const [textInput, setTextInput] = React.useState('');
  const [selectedStatut, setselectedStatut] = React.useState(0);

  function handleInputChangeType(event, value) {
    
    setselectedStatut(value);
  }


  React.useEffect(() => {


    if (loading) return;
    if (!user) return navigate("/");

    //fetchAllClient();
  }, []);

  const closeModal = async () => {
    setOpen(false)
  }



  const changeStatut = async () => {


    setIsDisabled(true)


   

    console.log("data to send to move package statut : ",
    Props.p_data.uid,
      formatPackageStatus(selectedStatut),
      user.email
    )
    adminMovePackageStatut({

      packageKey: Props.p_data.uid,
      statut: formatPackageStatus(selectedStatut),
      email : user.email
      

    })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;

        console.log("result  : ", result)

        if (data.success) {
          setOpen(false);
          navigate("/package");
        }
        else {
          setOpen(false);
        }
        //     const profList = data.profList;
      });


  };;

  return (
    <div>
      <Button onClick={handleOpen}>Change Status</Button>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off">
            </Box>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={myPackageStatus(Props.p_data.statut)}
                onInputChange={handleInputChangeType}
                renderInput={(params) => <TextField {...params} label="Statut" />}
              />
            </Grid>
            <br></br>

            <Grid xs={6}> <Button onClick={changeStatut} disabled={isDisabled}>move</Button>
              <Button onClick={closeModal} disabled={isDisabled}>close</Button></Grid>
            <Grid xs={6}>    </Grid>

            <br>
            </br>

          </Box>


        </Modal>
      </Box>
    </div>
  );
}