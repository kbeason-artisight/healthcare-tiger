import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import type { Patient } from "./api/client";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import HealthRecords from "./pages/HealthRecords";
import LabResults from "./pages/LabResults";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Medications from "./pages/Medications";
import Profile from "./pages/Profile";

export default function App() {
  const [patient, setPatient] = useState<Patient | null>(null);

  return (
    <Routes>
      <Route
        path="/login"
        element={patient ? <Navigate to="/" replace /> : <Login onLogin={setPatient} />}
      />
      <Route
        element={
          patient ? (
            <Layout patient={patient} onLogout={() => setPatient(null)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<Navigate to="/health-records" replace />} />
        <Route path="/health-records" element={<HealthRecords />} />
        <Route path="/lab-results" element={<LabResults />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
