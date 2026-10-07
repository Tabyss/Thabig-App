import { LoginCard } from "../../features/auth/components/LoginCard";
import { WebGLBackground } from "../../features/auth/components/WebGLBackground";

export default function LoginPage() {
    const cyberpunkColors = {
        color1: "240046",
        color2: "3c096c",
        color3: "5a189a",
        color4: "7b2cbf",
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <WebGLBackground colors={cyberpunkColors} />
            <LoginCard />
        </div>
    );
}
