import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic API routes to prevent frontend errors
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User management endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Menu endpoints (mock responses for now)
  app.get("/api/menu", (req, res) => {
    res.json([
      {
        id: 1,
        name: "Veg Thali",
        category: "Lunch",
        price: 50,
        description: "Complete vegetarian meal",
        available: true,
        image: "/placeholder.svg"
      }
    ]);
  });

  // Orders endpoints (mock responses)
  app.get("/api/orders", (req, res) => {
    res.json([
      {
        id: "ORD001",
        status: "completed",
        total: 150,
        timestamp: new Date().toISOString(),
        items: []
      }
    ]);
  });

  app.post("/api/orders", (req, res) => {
    res.status(201).json({
      id: "ORD" + Date.now(),
      status: "pending",
      ...req.body
    });
  });

  // Admin endpoints (mock responses)
  app.get("/api/admin/analytics", (req, res) => {
    res.json({
      totalOrders: 1250,
      totalRevenue: 45000,
      activeUsers: 320,
      averageOrderValue: 85
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
