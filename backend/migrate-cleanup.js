/**
 * Migration Script: Remove tasks without userId
 *
 * This script connects to your MongoDB database and deletes all tasks
 * that do not have a userId field, which are orphaned/insecure records.
 *
 * Usage:
 *   node migrate-cleanup.js
 *
 * Make sure your .env file is in the backend directory with MONGO_URI set.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in .env');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully.\n');

    const db = mongoose.connection.db;
    const tasksCollection = db.collection('tasks');

    // Count tasks without userId
    const orphanedCount = await tasksCollection.countDocuments({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
      ],
    });

    console.log(`Found ${orphanedCount} task(s) without a userId.`);

    if (orphanedCount === 0) {
      console.log('No cleanup needed. All tasks have a userId.');
    } else {
      // Delete orphaned tasks
      const result = await tasksCollection.deleteMany({
        $or: [
          { userId: { $exists: false } },
          { userId: null },
        ],
      });

      console.log(`Deleted ${result.deletedCount} orphaned task(s).`);
    }

    // Summary
    const remainingCount = await tasksCollection.countDocuments();
    console.log(`\nRemaining tasks in database: ${remainingCount}`);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrate();
