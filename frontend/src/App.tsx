import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import type { Patient } from "./api/client";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  const [patient, setPatient] = useState<Patient | null>(null);

  return (
    <Routes>
      <Route
        path="/login"
        element={patient ? <Navigate to="/" replace /> : <Login onLogin={setPatient} />}
      />
      <Route
        path="/"
        element={
          patient ? (
            <Dashboard patient={patient} onLogout={() => setPatient(null)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
