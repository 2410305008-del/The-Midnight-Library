import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/pagehaven_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected Successfully: ${conn.connection.host}\x1b[0m`);
    return conn;
  } catch (error) {
    console.warn(`\x1b[33m⚠ MongoDB Connection Notice: Could not connect to MongoDB at ${mongoURI}.\x1b[0m`);
    console.warn(`\x1b[36mℹ Note: The backend will operate seamlessly with the curated in-memory bookstore repository until MongoDB is active.\x1b[0m`);
    return null;
  }
};

export default connectDB;
