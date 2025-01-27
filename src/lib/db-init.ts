/*
Initialiser la connexion à la base de données si elle n'est pas déjà établie.
*/
import { AppDataSource } from "./typeorm";

export const initializeDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
