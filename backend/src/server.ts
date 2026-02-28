import app from "./app.js";
import { startOfflineChecker } from "./jobs/offlineCheck.js";
import { startBookingExpiryChecker } from "./jobs/bookingExpiry.js";
import { initializeDatabase } from "./lib/init-db.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

async function startServer() {
  // Initialize database connection first
  const dbConnected = await initializeDatabase();
  if (!dbConnected) {
    console.error('Failed to connect to database. Server startup aborted.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Sanket Your Backend Is running on http://localhost:${PORT}`);

    // Background jobs
    startOfflineChecker();
    startBookingExpiryChecker();
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  const { disconnectDatabase } = await import('./lib/init-db.js');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  const { disconnectDatabase } = await import('./lib/init-db.js');
  await disconnectDatabase();
  process.exit(0);
});

startServer().catch(console.error);
