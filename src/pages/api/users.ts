import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../entities/User";
import { AppDataSource } from "../../lib/data-source";
import { initializeDB } from "../../lib/db-init";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!AppDataSource.isInitialized) {
      await initializeDB(); // Initialisez la connexion avant de l'utiliser
    }

    const userRepository = AppDataSource.getRepository(User);

    switch (req.method) {
      case "GET": {
        // Récupérer tous les utilisateurs
        const users = await userRepository.find();
        return res.status(200).json(users);
      }

      case "POST": {
        // Créer un nouvel utilisateur
        const { name, email } = req.body;

        if (!name || !email) {
          return res
            .status(400)
            .json({ error: "Name and email are required." });
        }

        const newUser = userRepository.create({ name, email });
        const savedUser = await userRepository.save(newUser);
        return res.status(201).json(savedUser);
      }

      case "PUT": {
        // Mettre à jour un utilisateur
        const { id, name, email } = req.body;

        if (!id || !name || !email) {
          return res
            .status(400)
            .json({ error: "ID, name, and email are required." });
        }

        const user = await userRepository.findOneBy({ id });
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        user.name = name;
        user.email = email;
        const updatedUser = await userRepository.save(user);
        return res.status(200).json(updatedUser);
      }

      case "DELETE": {
        // Supprimer un utilisateur
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: "ID is required." });
        }

        const user = await userRepository.findOneBy({ id });
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        await userRepository.remove(user);
        return res.status(200).json({ message: "User deleted successfully." });
      }

      default: {
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error("Error in /api/users:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
