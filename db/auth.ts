import { Model, DataTypes } from "sequelize";

import { sequelize } from "./index";

export class Auth extends Model {}

Auth.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userID: DataTypes.INTEGER,
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Auth", // We need to choose the model name
  }
);
