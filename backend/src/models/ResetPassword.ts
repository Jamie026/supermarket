import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/sequelize";
import { User } from "./User";

// Atributos requeridos en el modelo ResetPassword
interface ResetPasswordAttributes {
    id: number;
    user_id: number;
    token: string;
}

// Atributos opcionales al crear una entrada (id lo genera automáticamente)
type ResetPasswordCreationAttributes = Optional<ResetPasswordAttributes, "id">;

// Clase ResetPassword
export class ResetPassword extends Model<ResetPasswordAttributes, ResetPasswordCreationAttributes>
    implements ResetPasswordAttributes {
    public id!: number;
    public user_id!: number;
    public token!: string;
}

// Inicialización del modelo
ResetPassword.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE" // Elimina tokens si el usuario se elimina
        },
        token: {
            type: new DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: "reset_password", // Nombre de la tabla en la base de datos
        sequelize,
        timestamps: false   // No usar createdAt ni updatedAt
    }
);

// Relaciones
User.hasMany(ResetPassword, { foreignKey: "user_id" });
ResetPassword.belongsTo(User, { foreignKey: "user_id" });
