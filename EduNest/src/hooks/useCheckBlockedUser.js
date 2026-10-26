import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserById } from '../Api/userApi';
import { toast } from 'sonner';

function useCheckBlockedUser() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userId = user?.id;

    const { data: currentUser } = useQuery({
        queryKey: ["currentUser", userId],
        queryFn: () => getUserById(userId),
        enabled: Boolean(userId),
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (currentUser?.isBlocked === true){
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            toast.error("Your account has been blocked.");

            navigate("/login", {replace: true});
        }
    },[currentUser, navigate]);

}

export default useCheckBlockedUser
