import express from "express";
import { prisma } from "../lib/db.js";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { name, number, address } = req.body;
    
    if (!name || !number || !address) {
      return res.status(400).json({ error: "Name, number, and address are required" });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        number: number.trim(),
        address: address.trim(),
        isOnline: true
      }
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update user status (online/offline)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline } = req.body;

    if (typeof isOnline !== "boolean") {
      return res.status(400).json({ error: "isOnline must be a boolean" });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isOnline }
    });

    res.json({ user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
