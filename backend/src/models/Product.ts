import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/sequelize";
import { User } from "./User";

// Atributos requeridos en el modelo Product
interface ProductAttributes {
    id: number;
    name: string;
    stock: number;
    price: number;
    user_id: number; 
}

// Atributos opcionales al crear un producto (id lo genera automáticamente)
type ProductCreationAttributes = Optional<ProductAttributes, "id">;

// Clase Product
export class Product extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes {
    public id!: number;
    public name!: string;
    public stock!: number;
    public price!: number;
    public user_id!: number;
}

// Inicialización del modelo
Product.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: new DataTypes.STRING(100),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false, 
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE" // Elimina productos si el usuario se elimina
        }
    },
    {
        tableName: "products", // Nombre de la tabla en la base de datos
        sequelize,
        timestamps: false   // No usar createdAt ni updatedAt
    }
);

// Relaciones
User.hasMany(Product, { foreignKey: "user_id" });
Product.belongsTo(User, { foreignKey: "user_id" });
