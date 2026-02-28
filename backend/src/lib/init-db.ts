import { prisma } from './db.js';

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
}

export {
  initializeDatabase,
  disconnectDatabase
};
