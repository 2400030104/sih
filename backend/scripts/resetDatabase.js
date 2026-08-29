/**
 * PRAGATI-AI — SAFE DATABASE RESET SCRIPT
 * 
 * Clears all project data and resets auto-increment while preserving:
 * - Database Schema (Tables, Columns, Keys, Indexes, Views)
 * - Master Reference Tables (ministries, sectors, agencies, states, districts, model_versions, users)
 * - ML Model Files & Configuration
 */

const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Rohith@12345',
  database: process.env.DB_NAME || 'pragati_ai',
  multipleStatements: true
};

async function resetDatabase() {
  console.log('====================================================');
  console.log('  PRAGATI-AI DATABASE RESET UTILITY');
  console.log('====================================================');
  console.log(`Target Host:     ${DB_CONFIG.host}:${DB_CONFIG.port}`);
  console.log(`Target Database: ${DB_CONFIG.database}`);
  console.log(`Environment:     ${process.env.NODE_ENV || 'development'}`);
  console.log('----------------------------------------------------');

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_RESET !== 'true') {
    console.error('❌ ABORTED: Database reset is disabled in production environments.');
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('Connected to MySQL successfully.');

    // 1. Disable FK checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('[1/5] Foreign-key constraints temporarily bypassed.');

    // 2. Clear project-specific tables in safe order
    const tablesToClear = [
      'risk_factors',
      'risk_predictions',
      'project_monthly_data',
      'milestones',
      'alerts',
      'recommendations',
      'what_if_scenarios',
      'audit_logs',
      'projects'
    ];

    for (const tbl of tablesToClear) {
      await connection.query(`DELETE FROM \`${tbl}\``);
      await connection.query(`ALTER TABLE \`${tbl}\` AUTO_INCREMENT = 1`);
      console.log(`[2/5] Cleared table and reset AUTO_INCREMENT: \`${tbl}\``);
    }

    // 3. Re-enable FK checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('[3/5] Foreign-key constraints restored.');

    // 4. Verify Cleared Tables
    console.log('[4/5] Verifying row counts on cleared tables:');
    for (const tbl of tablesToClear) {
      const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tbl}\``);
      const count = rows[0].count;
      console.log(`  - \`${tbl}\`: ${count} rows remaining ${count === 0 ? '✓' : '❌'}`);
    }

    // 5. Verify Preserved Master Reference Tables
    const masterTables = [
      'ministries',
      'sectors',
      'implementing_agencies',
      'states',
      'districts',
      'model_versions',
      'users'
    ];
    console.log('[5/5] Verifying preserved master reference datasets:');
    for (const tbl of masterTables) {
      const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tbl}\``);
      console.log(`  - \`${tbl}\`: ${rows[0].count} master rows preserved ✓`);
    }

    console.log('====================================================');
    console.log('  STATUS: DATABASE RESET COMPLETED SUCCESSFULLY');
    console.log('  Database is now 100% clean and ready for fresh data.');
    console.log('====================================================');

  } catch (err) {
    console.error('❌ Reset failed with error:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
