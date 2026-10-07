import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth.service";
import { useAuthStore } from "../../../shared/stores/user.store";

export const useLoginMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    return useMutation<
        { access_token: string },
        Error,
        Parameters<typeof loginApi>[0]
    >({
        mutationFn: (credentials) =>
            loginApi(credentials) as Promise<{ access_token: string }>,
        onSuccess: (data) => {
            setAuth(data.access_token);
            navigate("/");
        },
    });
};
