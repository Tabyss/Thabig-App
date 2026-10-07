import React from "react";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginCard: React.FC = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
        isPending,
        isError,
        errorMessage,
    } = useLoginForm();

    return (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 font-sans">
            <div
                className="w-full max-w-md p-8 sm:p-10 rounded-4xl shadow-2xl backdrop-blur-xl border border-white/10"
                style={{
                    background:
                        "radial-gradient(130% 130% at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.6) 100%)",
                    boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                }}
            >
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-light tracking-wide text-white">
                        Thabig <span className="font-semibold text-amber-500">Access</span>
                    </h2>
                    <p className="mt-2 text-sm text-white/50">Authenticate to continue</p>
                </div>

                {isError && (
                    <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-center backdrop-blur-md">
                        {errorMessage || "Authentication Failed"}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-medium tracking-wider text-white/60 uppercase">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-white/20"
                            placeholder="user@network.local"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium tracking-wider text-white/60 uppercase">
                                Password
                            </label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-white/20"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="relative w-full py-3.5 mt-4 overflow-hidden text-sm font-semibold text-white rounded-xl group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-orange-600 to-amber-500 transition-transform duration-300 group-hover:scale-[1.02]"></div>
                        <div className="absolute inset-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center justify-center gap-2">
                            {isPending ? "Authenticating..." : "Initialize Connection"}

                            {!isPending && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </span>
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-white/50">
                    New operator?{" "}
                    <a
                        href="/register"
                        className="font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                    >
                        Request access
                    </a>
                </p>

                <div className="mt-6 text-center border-t border-white/10 pt-6">
                    <p className="text-xs text-white/40">
                        Secured via Quantum Encryption Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};