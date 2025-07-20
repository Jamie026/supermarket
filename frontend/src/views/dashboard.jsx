import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="container mt-5">
            <h1>Bienvenido al Dashboard</h1>
            <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
}

export default Dashboard;
