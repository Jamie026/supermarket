import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/sequelize";
import { User } from "./User";

interface ProductAttributes {
    id: number;
    name: string;
    stock: number;
    price: number;
    user_id?: number;
}

type ProductCreationAttributes = Optional<ProductAttributes, "id">;

export class Product extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes {
    public id!: number;
    public name!: string;
    public stock!: number;
    public price!: number;
    public user_id?: number;
}

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
            allowNull: true,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "SET NULL"
        },
    },
    {
        tableName: "products",
        sequelize,
        timestamps: false
    }
);

User.hasMany(Product, { foreignKey: "user_id" });
Product.belongsTo(User, { foreignKey: "user_id" });
