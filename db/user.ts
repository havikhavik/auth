import { Model, DataTypes } from "sequelize";

import { sequelize } from "./index";

export class User extends Model {}

User.init(
  {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    birthdate: DataTypes.DATE,
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "User", // We need to choose the model name
  }
);
