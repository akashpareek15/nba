import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { Questions } from "./Questions";
import { Dashboard } from "./Dashboard";
import { Keywords } from "./Keywords";
import { DownloadCriteria } from "./DownloadCriteria";

export const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />

          <Route path="home/" element={<Home />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="keywords" element={<Keywords />} />
            <Route path="download" element={<DownloadCriteria />} />
            <Route
              path="criteria/:criteriaId/questions"
              element={<Questions />}
            />
            <Route path="**" element={<Navigate to={"dashboard"} />} />
          </Route>
          <Route path="/" element={<Navigate to={"/login"} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
