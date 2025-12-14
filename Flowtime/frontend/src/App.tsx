import react from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Project from "./pages/Project";
import ProjectDetails from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import Calendar from "./pages/Calendar";

function Logout() {
    // Pour supprimer les tokens du localStorage lors de la déconnexion
    localStorage.clear();
    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
}

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    {/* Inscription et login */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterAndLogout />} />
                    <Route path="/signin" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route
                        path="/project"
                        element={
                            <ProtectedRoute>
                                <Project />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/project/:id"
                        element={
                            <ProtectedRoute>
                                <ProjectDetails />
                            </ProtectedRoute>
                        }
                    />{" "}
                    <Route
                        path="/project/:projectId/task/:taskId"
                        element={
                            <ProtectedRoute>
                                <TaskDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <Calendar />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
