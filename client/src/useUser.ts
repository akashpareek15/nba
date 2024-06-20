import { useEffect, useState } from "react"
import { IUser } from "./domain/IUser";

export const useUser = () => {

    const [loggedInUser, setLoggedInUser] = useState<IUser>();

    useEffect(() => {
        const user = (localStorage.getItem('user') ?? sessionStorage.getItem('user'));
        setLoggedInUser(JSON.parse(user));
    }, []);
    return {
        loggedInUser,
        isAdmin: loggedInUser?.role === 'admin'
    }
}