import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/sequelize";

interface UserAttributes {
    id: number;
    name: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    birthday?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public lastname!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public birthday?: Date;
}

User.init(
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
        lastname: {
            type: new DataTypes.STRING(100),
            allowNull: false
        },
        username: {
            type: new DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    {
        tableName: "users",
        sequelize,
        timestamps: false
    }
);
