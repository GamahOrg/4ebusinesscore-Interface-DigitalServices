import { FC, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import ErrorsPage from "../modules/errors/ErrorsPage";
import { PrivateRoutes } from "./PrivateRoutes";
import { MasterLayout } from "../layout/MasterLayout";
import { App } from "../App";
import Logout from "../modules/auth/Logout";

const { PUBLIC_URL } = (window as any)._env_;
const isDev = (window as any)._env_?.NODE_ENV === "development";

const AppRoutes: FC = () => {
  const [LoggedUser, setLoggedUser] = useState<null | boolean>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setLoggedUser(user !== null);
  }, []);

  useEffect(() => {
    if (LoggedUser === false && !isDev) {
      // Redirect to external page only in production
      window.location.href = (window as any)._env_?.REACT_APP_Base_Url ?? "/";
    }
  }, [LoggedUser]);

  if (LoggedUser === null) {
    // Wait until we know if user is logged in
    return null;
  }
  const currentToken = localStorage.getItem("token");
  localStorage.setItem("token", currentToken as string);

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          <Route element={<MasterLayout />} />

          {localStorage.getItem("token") &&
          localStorage.getItem("token") != null ? (
            <Route path="/*" element={<PrivateRoutes />} />
          ) : (
            // Show internal auth routes only in dev
            isDev && (
              <>
                {/* <Route path="auth/*" element={<AuthPage />} /> */}
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            )
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
