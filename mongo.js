// Dedicated Mongo file in root as requested by user
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes and establishes the MongoDB database connection for PageHaven Bookstore & E-Library.
 */
export const connectMongo = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/pagehaven_db';

  try {
    console.log(`[Mongo] Connecting to MongoDB instance at: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    console.log(`[Mongo] Successfully connected to database: ${connection.connection.name}`);
    return connection;
  } catch (error) {
    console.error(`[Mongo Error] Database connection error: ${error.message}`);
    return null;
  }
};

/**
 * Returns current MongoDB connectivity state.
 */
export const checkMongoHealth = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  return {
    status: states[stateIndex] || 'Unknown',
    readyState: stateIndex,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
};

export default connectMongo;
