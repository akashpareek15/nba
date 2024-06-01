import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CriteriaContainer } from "./CriteriaContainer";
import { Dashboard } from "./Dashboard";
import { Home } from "./Home";
import { Questions } from "./Questions";
import { Login } from "./Login";
import { Register } from "./Register";

// import route paths


export const AppRoutes = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="criteria/" element={<Home />}>
                    <Route path=":criteriaId" element={<CriteriaContainer />} />
                    <Route path=":criteriaId/departments/:departmentId/questions" element={<Questions />} />

                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/" element={<Navigate to={'/login'} />} />
                <Route path="**" element={<Navigate to={'/login'} />} />
            </Routes>
        </BrowserRouter>
    </>
}