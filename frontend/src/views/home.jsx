import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        name: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        birthday: ""
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const toggleForm = () => setIsLogin(!isLogin);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const { data } = await axios.post("/users/login", {
                    username: form.username,
                    password: form.password,
                });
                localStorage.setItem("token", data.token);
                toast.success("Inicio de sesión exitoso");
                login();
                navigate("/dashboard");
            } else {
                await axios.post("/users/register", form);
                toast.success("Usuario registrado correctamente");
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error desconocido");
        }
    };

    return (
        <div className="home-container d-flex align-items-center justify-content-center vh-100 bg-warning-subtle">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="form-wrapper shadow-lg rounded-4 p-4 bg-light" style={{ minWidth: "350px", maxWidth: "500px" }}>
                <h2 className="text-center mb-4 text-success fw-bold">
                    {isLogin ? "Iniciar Sesión" : "Crea tu cuenta"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Nombre"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Apellido"
                                        name="lastname"
                                        value={form.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <input
                                type="email"
                                className="form-control mb-3"
                                placeholder="Email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <div className="mb-3">
                                <label htmlFor="birthday" className="form-label">Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="birthday"
                                    name="birthday"
                                    value={form.birthday}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Usuario"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Contraseña"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm">
                        Aceptar
                    </button>
                </form>
                <div className="text-center mt-3">
                    <small>
                        {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
                        <button
                            className="btn btn-link text-decoration-none text-danger"
                            onClick={toggleForm}
                        >
                            {!isLogin ? "Inicia Sesión" : "Registrate"}
                        </button>
                    </small>
                </div>
            </div>
        </div>
    );
}
