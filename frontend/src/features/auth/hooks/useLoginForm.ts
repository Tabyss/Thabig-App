import { useState } from "react";
import { useLoginMutation } from "./useLoginQueries";

export const useLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useLoginMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    const backendError = loginMutation.error as {
        response?: { data?: { detail?: string } };
        message?: string;
    } | null;

    const errorMessage =
        backendError?.response?.data?.detail || backendError?.message;

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
        isPending: loginMutation.isPending,
        isError: loginMutation.isError,
        errorMessage,
    };
};
