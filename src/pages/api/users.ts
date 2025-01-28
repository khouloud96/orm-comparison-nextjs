import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      // CREATE: Ajouter un utilisateur
      case "POST": {
        const { name, email } = req.body;

        if (!name || !email) {
          return res
            .status(400)
            .json({ error: "Name and email are required." });
        }

        const result = await db
          .insertInto("users")
          .values({ name, email })
          .returning("id")
          .executeTakeFirst();

        return res
          .status(201)
          .json({
            id: result?.id.toString(),
            message: "User created successfully.",
          });
      }

      // READ: Récupérer tous les utilisateurs
      case "GET": {
        const users = await db.selectFrom("users").selectAll().execute();
        return res.status(200).json(
          users.map((user) => ({
            ...user,
            id: user.id.toString(),
          }))
        );
      }

      // UPDATE: Mettre à jour un utilisateur
      case "PUT": {
        const { id, name, email } = req.body;

        if (!id || !name || !email) {
          return res
            .status(400)
            .json({ error: "ID, name, and email are required." });
        }

        const updated = await db
          .updateTable("users")
          .set({
            name,
            email,
          })
          .where("id", "=", id)
          .executeTakeFirst(); // Renvoie un objet contenant `numUpdatedRows`

        // Vérifiez si des lignes ont été mises à jour
        if (updated && updated.numUpdatedRows > 0) {
          return res.status(200).json({
            message: "User updated successfully.",
            rowsAffected: updated.numUpdatedRows.toString(),
          });
        }
      }

      // DELETE: Supprimer un utilisateur
      case "DELETE": {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: "User ID is required." });
        }

        const deleted = await db
          .deleteFrom("users")
          .where("id", "=", id)
          .executeTakeFirst();

        return res.status(200).json({
          message: "User deleted successfully.",
          rowsAffected: deleted?.numDeletedRows.toString(),
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/kysely/users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
