import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import ProjectForm from "./pages/ProjectForm";
import UserForm from "./pages/UserForm";
import TaskForm from "./pages/TaskForm";
import UserDetails from "./pages/UserDetails";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/projects/:id" element={<ProjectDetails />} />

            <Route path="/tasks" element={<Tasks />} />

            <Route path="/tasks/:id" element={<TaskDetails />} />

            <Route
              path="/users"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <Users />
                </RoleGuard>
              }
            />

            <Route
              path="/users/:id"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <UserDetails />
                </RoleGuard>
              }
            />

            <Route
              path="/users/new"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <UserForm />
                </RoleGuard>
              }
            />

            <Route
              path="/audit-logs"
              element={
                <RoleGuard allowedRoles={["ADMIN"]}>
                  <AuditLogs />
                </RoleGuard>
              }
            />

            <Route
              path="/projects/new"
              element={
                <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                  <ProjectForm />
                </RoleGuard>
              }
            />

            <Route
              path="/projects/:id/edit"
              element={
                <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                  <ProjectForm />
                </RoleGuard>
              }
            />

            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/new"
              element={
                <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                  <TaskForm />
                </RoleGuard>
              }
            />

            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/:id/edit"
              element={
                <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>
                  <TaskForm />
                </RoleGuard>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
