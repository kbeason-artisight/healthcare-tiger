import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import type { Patient } from "./api/client";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Medications from "./pages/Medications";

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
        <Route path="/" element={<Dashboard patient={patient!} />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/billing" element={<Billing />} />
      </Route>
    </Routes>
  );
}
