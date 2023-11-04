import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, addDoc,collection, getDocs,getDoc,setDoc ,arrayUnion, arrayRemove,updateDoc, where, doc, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";



function updateInputWithIds(offres, input) {
  let output = [];
  for (let i = 0; i < input.length; i++) {
    let element = input[i];
    for (let j = 0; j < offres.length; j++) {
      let offresElement = offres[j];
      if (offresElement.name === element.level) {
        for (let k = 0; k < offresElement.children.length; k++) {
          let childrenElement = offresElement.children[k];
          if (childrenElement.name === element.name) {
            output.push({
              id: childrenElement.id,
              name: element.name,
              level: element.level
            });
            break;
          }
        }
        break;
      }
    }
  }
  return output;
}


function transformArray(array) {
  let transformedArray = [];
  
  for (let i = 0; i < array.length; i++) {
    let splitArray = array[i].split(" - ");
    transformedArray.push({ level: splitArray[0], name: splitArray[1] });
  }
  
  return transformedArray;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ActiverOffreModal(Props) {


  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [isDisabled, setIsDisabled] = React.useState(false);
  const navigate = useNavigate();

  const updateCours = async () => {

    setIsDisabled(true);
   
   const current_cours = Props.coursToBeActivated;
   const prof_uid = Props.prof;

    const profProfile = doc(db, "Users",  prof_uid);
    const profProfileSnap = await getDoc(profProfile);
    const myprofile = profProfileSnap.data()
    
    const myActiveCourses = myprofile.courses
    const myDesactiveCourses = myprofile.coursesToValidate
    myActiveCourses.push(current_cours)

    var filtered = myDesactiveCourses.filter(function(value, index, arr){ 
        return value != current_cours;
    });


    // const llaOffers = doc(db, "Courses",  "Courses")
    // const offreSnap = await getDoc(llaOffers);
    // const allofers = offreSnap.data()


    let current_offer = transformArray([current_cours])[0]
    var OffreList = myprofile.offer
  
    var valueInofferToValidate = myprofile.offerToValidate.filter(function(value){ 
      return value.level == current_offer.level 
      && value.name ==current_offer.name ;
  });

  var theNewCurrentOffre   = OffreList.concat(valueInofferToValidate[0])


  var newofferToValidate = myprofile.offerToValidate.filter(function(value){ 
    return value.id != valueInofferToValidate[0].id ;
});
    
 

    await updateDoc(profProfile, {
      courses: myActiveCourses,
      coursesToValidate: filtered, 
   });


    await updateDoc(profProfile, {
      offer: theNewCurrentOffre,
      offerToValidate: newofferToValidate, 
   });



  const querySnapshotTrackValidation = collection(db, "Users", prof_uid, "TrackValidation")
  

  const docRef = await addDoc(querySnapshotTrackValidation, 
    
    {

      by: user.email,
      cours:current_cours,
      date : new Date(),
      type_validation: "active",
      type : "cours" , 
      remarque : " ", 
    });

    Props.setCourses(filtered)

    setOpen(false);
    setIsDisabled(false);

   
    

  };

 
  

  return (
    <div>
      <Button onClick={handleOpen}>Activer l'offre</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez activer l'offre  : {Props.coursToBeActivated}
          </Typography>
          <Typography id="modal-modal-title" variant="h4" component="h1">
            {Props.coursToBeActivated}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Proffesseur : {Props.prof.firstname}
          </Typography>
          <Button onClick={updateCours} disabled={isDisabled}>Valider</Button>
        </Box>
        
      </Modal>
    </div>
  );
}
