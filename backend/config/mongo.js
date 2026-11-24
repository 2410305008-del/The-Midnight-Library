// Dedicated Mongo Connection File as requested
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const initMongoConnection = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/pagehaven_db';
  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Mongo] Connected to database: ${db.connection.name}`);
    return db;
  } catch (err) {
    console.error(`[Mongo Error] Failed to connect to ${uri}: ${err.message}`);
    return null;
  }
};

export const getDbStatus = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  return {
    state: states[mongoose.connection.readyState] || 'Unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
};

export default initMongoConnection;
