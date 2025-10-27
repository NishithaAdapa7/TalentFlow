import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPages';
import AdminDashboard from './Pages/AdminDashboard';
import UserDashboard from './Pages/UserDashboard';
import AddJob from './Admin/AdminComponents/AddJobs';
import JobDetail from './Admin/AdminComponents/JobDetails';
import CandidateList from './Admin/Candidates/CnadidateList';
import CandidateKanban from './Admin/Candidates/CandidateKanban';
import CandidateProfile from './Admin/Candidates/CandidateProfile';
import CandidateContainer from './Admin/Candidates/CandidateContainer';
import AssessmentBuilder from './Admin/Assessments/AssessmentBuilder';
import AssessmentsList from './Admin/Assessments/Assessments';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/admin" element={<AddJob/>} />
       <Route path="/jobs/:id" element={<JobDetail/>} />
        <Route path="/candidatesList" element={<CandidateList/>} />
         <Route path="/candidates" element={<CandidateContainer/>} />
      <Route path="/candidates/kanban" element={<CandidateKanban/>} />
      <Route path="/candidates/:id" element={<CandidateProfile/>} />
      <Route path="/assessments" element={<AssessmentsList />} />
      <Route path="/assessments/new" element={<AssessmentBuilder />} />
      <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />

    </Routes>
  );
}

export default App;
