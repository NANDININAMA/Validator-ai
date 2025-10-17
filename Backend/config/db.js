const mongoose = require("mongoose");
let mongoMemoryServerInstance = null;

const connectDB = async () => {
  try {
    // If running tests with in-memory flag, spin up MongoMemoryServer
    if (process.env.USE_IN_MEMORY_DB === 'true') {
      const is32bit = process.arch === 'ia32';
      if (is32bit) {
        console.warn('In-memory MongoDB not supported on ia32; falling back to MONGO_URI');
      } else {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServerInstance = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServerInstance.getUri();
        await mongoose.connect(memoryUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("MongoDB In-Memory Connected ✅");
        return;
      }
    }

    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startup_validator';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌", err);
    // During tests, do not terminate the process; surface the error instead
    if (process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test') {
      throw err;
    }
    process.exit(1); // stop the server if DB fails in non-test env
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServerInstance) {
      await mongoMemoryServerInstance.stop();
      mongoMemoryServerInstance = null;
    }
    console.log("MongoDB Disconnected ✅");
  } catch (err) {
    console.error("MongoDB disconnection error ❌", err);
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
