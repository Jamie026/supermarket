import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        name: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        birthday: ""
    });

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [code, setCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [resetUserId, setResetUserId] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    const toggleForm = () => setIsLogin(!isLogin);

    const handleVerifyCode = async () => {
        try {
            const { data } = await axios.post("/users/verify-reset-code", { code });

            if (data.success) {
                toast.success("Código verificado. Ingresa una nueva contraseña.");
                setResetUserId(data.userId);
            } else {
                toast.error("Código inválido o expirado");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error al verificar el código");
        }
    };

    const handleSendCode = async () => {
        try {
            await axios.post("/users/forgot-password", { email: resetEmail });
            toast.success("Código enviado al correo");
            setCodeSent(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error al enviar código");
        }
    };

    const handleUpdatePassword = async () => {
        try {
            await axios.post("/users/reset-password", {
                email: resetEmail,
                newPassword
            });

            toast.success("Contraseña actualizada. Ya puedes iniciar sesión.");
            setShowResetModal(false);
            setResetEmail("");
            setCode("");
            setCodeSent(false);
            setResetUserId(null);
            setNewPassword("");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error al actualizar contraseña");
        }
    };

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

                {isLogin && (
                    <div className="text-center mt-2">
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none text-primary"
                            onClick={() => setShowResetModal(true)}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                )}

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

            {showResetModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Recuperar Contraseña</h5>
                                <button type="button" className="btn-close" onClick={() => {
                                    setShowResetModal(false);
                                    setResetEmail("");
                                    setCode("");
                                    setCodeSent(false);
                                }}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="email"
                                    className="form-control mb-3"
                                    placeholder="Correo electrónico"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    required
                                />

                                {codeSent && (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            placeholder="Ingrese el código enviado"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />

                                        {resetUserId && (
                                            <input
                                                type="password"
                                                className="form-control mb-3"
                                                placeholder="Nueva contraseña"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => {
                                    setShowResetModal(false);
                                    setResetEmail("");
                                    setCode("");
                                    setCodeSent(false);
                                    setResetUserId(null);
                                    setNewPassword("");
                                }}>Cancelar</button>

                                {!codeSent ? (
                                    <button className="btn btn-primary" onClick={handleSendCode}>Enviar código</button>
                                ) : !resetUserId ? (
                                    <button className="btn btn-success" onClick={handleVerifyCode}>Verificar código</button>
                                ) : (
                                    <button className="btn btn-warning" onClick={handleUpdatePassword}>Actualizar contraseña</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
