// db.ts
import mongoose from 'mongoose';
import * as Sentry from '@sentry/node'; 

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    // Optional: log a Sentry breadcrumb or span
    Sentry.captureMessage(`MongoDB connected to ${conn.connection.host}`, 'info');

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;

    // Send the error to Sentry
    Sentry.captureException(err);
    console.error(`❌ Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
