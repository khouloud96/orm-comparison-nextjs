import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialiser Prisma Client
const prisma = new PrismaClient();

// Gestionnaire API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Vérifier la méthode HTTP
    switch (req.method) {
      // CREATE : Ajouter un utilisateur
      case "POST": {
        const { name, email } = req.body;

        if (!name || !email) {
          return res.status(400).json({ error: "Name and email are required" });
        }

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
          },
        });

        return res.status(201).json(newUser);
      }

      // READ : Récupérer tous les utilisateurs
      case "GET": {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
      }

      // UPDATE : Modifier un utilisateur
      case "PUT": {
        const { id, name, email } = req.body;

        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const updatedUser = await prisma.user.update({
          where: { id: Number(id) },
          data: { name, email },
        });

        return res.status(200).json(updatedUser);
      }

      // DELETE : Supprimer un utilisateur
      case "DELETE": {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        await prisma.user.delete({
          where: { id: Number(id) },
        });

        return res.status(204).end();
      }

      // Méthode non supportée
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in /api/users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
