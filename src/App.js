import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Course from "./pages/course/course"
import ResponsiveAppBar from "./bar"
import AllStudents from "./pages/client/listUser"
import ListProf from "./pages/proffeusseurs/AllProf"
import Kpi from "./pages/course/kpi"
import ProfProfile from "./pages/proffeusseurs/prof/profProfile"
import Credit from "./pages/proffeusseurs/prof/credit/credit"
import WaitingCourse from "./pages/course/WaitingCourse"
import TodyCoursCofimed from "./pages/course/TodyCoursComfirmed.js";
import TodyCours from "./pages/course/TodyCours.js";
import StudentfProfile from "./pages/client/eleve/eleveprofile";
import ParentProfile from "./pages/client/parent/parentprofile";
import AjouterEnfent from "./pages/client/parent/ajoutenfent";
import ProfDispo from "./pages/course/prscourse";
import ProfDispoCandidate from "./pages/course/prscourseCandidate";
import NextCommand from "./pages/commands/nextCommand";
import CanceledCours from "./pages/course/allcanceledcours";
import AnciensCours from "./pages/course/ancienCoure";
import NotFinishInscription from "./pages/client/userNoteFinishInscription"


function App() {
  return (
    <div className="app">
      <Router>
      <Login/>
        <Routes>

          <Route exact path="/todaycourscomfirme" element={<TodyCoursCofimed />}/>
          <Route exact path="/todaycours" element={<TodyCours />}/>
          <Route exact path="/kpi" element={<Kpi />}/>
          <Route exact path="/waitingcourse" element={<WaitingCourse />}/>
          <Route exact path="/profs" element={<ListProf />}/>
          <Route exact path="/clients" element={<AllStudents />}/>
          <Route exact path="/Inscritnotcomplet" element={<NotFinishInscription />}/>
          <Route exact path="/profProfile" element={<ProfProfile/>}/>
          <Route exact path="/commands" element={<NextCommand/>}/>
          <Route exact path="/ancienscours" element={<AnciensCours/>}/>
          <Route exact path="/allcanceledcours" element={<CanceledCours/>}/>
          <Route exact path="/profProfile/credit" element={<Credit/> }/>
          <Route exact path="/user/profile/student" element={<StudentfProfile /> } />
          <Route exact path="/user/profile/parent" element={<ParentProfile /> } />
          <Route exact path="/parent/enfent/ajout" element={<AjouterEnfent /> } /> 
          <Route exact path="/user/profile/course" element={<Course /> } /> 
          <Route exact path="/user/course/profdispo" element={<ProfDispo /> } /> 
          <Route exact path="/user/course/profdispocandidate" element={<ProfDispoCandidate /> } />   // canceledcours
        </Routes>
      </Router>
    </div>
  );
}

export default App;
