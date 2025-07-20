import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/sequelize";
import { User } from "./User";

interface ResetPasswordAttributes {
    id: number;
    user_id: number;
    token: string;
}

type ResetPasswordCreationAttributes = Optional<ResetPasswordAttributes, "id">;

export class ResetPassword extends Model<ResetPasswordAttributes, ResetPasswordCreationAttributes>
    implements ResetPasswordAttributes {
    public id!: number;
    public user_id!: number;
    public token!: string;
}

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
            onDelete: "CASCADE"
        },
        token: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
    },
    {
        tableName: "reset_password",
        sequelize,
        timestamps: false
    }
);

User.hasMany(ResetPassword, { foreignKey: "user_id" });
ResetPassword.belongsTo(User, { foreignKey: "user_id" });
