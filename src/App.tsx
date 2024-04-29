import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/Authentication/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LibraryPage } from "@/pages/Library/LibraryPage";
import { AuthProvider } from "./hooks/useAuth";
import { RegisterPage } from "./pages/Authentication/RegisterPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
