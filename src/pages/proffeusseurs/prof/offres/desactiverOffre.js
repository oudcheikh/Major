import * as React from 'react';
import { useState, createContext, useContext } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { auth, logInWithEmailAndPassword, signInWithGoogle, logout, db } from "../../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, addDoc, collection, getDocs,getDoc,setDoc ,arrayUnion, arrayRemove,updateDoc, where, doc, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

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

export default function DesactiverModal(Props) {
  
  
  

  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  


  const updateCours = async () => {
  
   
    
   const current_cours = Props.coursToBeDesactivated;
   const prof_uid = Props.prof;

    const profProfile = doc(db, "Users",  prof_uid);
    const profProfileSnap = await getDoc(profProfile);
    const myprofile = profProfileSnap.data()
    
    const myActiveCourses = myprofile.courses
    const myDesactiveCourses = myprofile.coursesToValidate
    myDesactiveCourses.push(Props.coursToBeDesactivated)

    var filtered = myActiveCourses.filter(function(value, index, arr){ 
        return value != current_cours;
    });


    let current_offer = transformArray([current_cours])[0]
    var OffreToValidateList = myprofile.offerToValidate
  
    var valueInoffer = myprofile.offer.filter(function(value){ 
      return value.level == current_offer.level 
      && value.name ==current_offer.name ;
  });

  var theNewOffreToValidate   = OffreToValidateList.concat(valueInoffer[0])


  var newoffer = myprofile.offer.filter(function(value)
  { 
    return value.id != valueInoffer[0].id ;
});
    
   
  console.log("________________________________ : myDesactiveCourses : ", myDesactiveCourses)
  console.log("________________________________ : filtered  : ", filtered)
  console.log("________________________________ : newoffer : ", newoffer)
  console.log("________________________________ : theNewOffreToValidate  : ", theNewOffreToValidate)


   
    await updateDoc(profProfile, {
      courses: filtered,
      coursesToValidate: myDesactiveCourses, 
   });


  
  await updateDoc(profProfile, {
    offer: newoffer,
    offerToValidate: theNewOffreToValidate, 
 });



const querySnapshotTrackValidation = collection(db, "Users", prof_uid, "TrackValidation")

const docRef = await addDoc(querySnapshotTrackValidation, 
  
  {

    by: user.email,
    cours:current_cours,
    date : new Date(),
    type_validation: "desactive",
    type : "cours" , 
    remarque : " ", 
  });

  Props.setCourses(filtered)

  setOpen(false);



  // const phone = ""
  //  const data = ""
  //  const uid = prof_uid
  //  navigate("/profProfile",
  //  {
  //    state: { phone, data, uid },
  //  });



  };

 
  return (
    <div>
      <Button onClick={handleOpen}>Desactiver l'offre</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vous voulez desactiver l'offre  : {Props.coursToBeDesactivated}
          </Typography>
          <Typography id="modal-modal-title" variant="h4" component="h1">
            {Props.prof.coursToBeDesactivated}
          </Typography>
          
          <Button onClick={updateCours}>Valider</Button>
        </Box>
      </Modal>
    </div>
  );
}
