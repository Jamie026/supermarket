import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", stock: "", price: "" });
    const [editing, setEditing] = useState(null);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: "Bearer " + token,
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/products", config);
            setProducts(data);
        } catch (err) {
            toast.error("Error al obtener productos");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchProducts();
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put("/products/" + editing, form, config);
                toast.success("Producto actualizado");
            } else {
                await axios.post("/products", form, config);
                toast.success("Producto creado");
            }
            setForm({ name: "", stock: "", price: "" });
            setEditing(null);
            fetchProducts();
        } catch (err) {
            toast.error("Error al guardar producto");
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditing(product.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await axios.delete("/products/" + id, config);
            toast.success("Producto eliminado");
            fetchProducts();
        } catch (err) {
            toast.error("Error al eliminar producto");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="home-container bg-warning-subtle">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success fw-bold">Gestión de Productos</h2>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>

            <div className="form-wrapper p-4 mb-4">
                <h4 className="mb-3">{editing ? "Editar Producto" : "Nuevo Producto"}</h4>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Stock"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Precio"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-success fw-bold w-100 shadow-sm">
                            {editing ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-responsive rounded shadow-sm">
                <table className="table table-striped table-hover align-middle mb-0 border">
                    <thead className="table-success text-center">
                        <tr>
                            <th>Nombre</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">No hay productos</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="text-center">
                                    <td className="fw-semibold">{product.name}</td>
                                    <td>{product.stock}</td>
                                    <td>S/ {product.price}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => handleEdit(product)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(product.id)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;