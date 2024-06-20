import { AdminHome } from "./AdminHome";
import { DepartmentHome } from "./DepartmentHome";
import { useUser } from "./useUser";

export const Dashboard = () => {
    const { loggedInUser } = useUser();

    return <>  {loggedInUser?.role === 'admin' ? <AdminHome /> : <DepartmentHome />}</>
}