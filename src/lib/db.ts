import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export interface Database {
  users: {
    id: number; // Clé primaire
    name: string;
    email: string;
    created_at: Date;
  };
}

// Ajouter un type Insertable pour spécifier les colonnes optionnelles lors de l'insertion
/*export type InsertableUser = {
  name: string;
  email: string;
  created_at?: Date; // Optionnel lors de l'insertion (peut être défini par défaut)
};*/

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
