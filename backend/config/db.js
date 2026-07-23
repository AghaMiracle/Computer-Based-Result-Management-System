import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Resiliency options — Atlas connections (especially shared/free tiers)
      // can drop briefly. These keep the driver retrying instead of letting
      // mongoose buffer a command until it times out with a 500.
      serverSelectionTimeoutMS: 10000, // fail fast if no server is reachable
      socketTimeoutMS: 45000,          // close idle sockets after 45s
      maxPoolSize: 10,                 // reuse connections instead of thrashing
      minPoolSize: 2,                  // keep warm connections ready
      retryWrites: true,               // auto-retry a write once on transient errors
      family: 4,                       // prefer IPv4 (avoids slow IPv6 DNS on some networks)
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
