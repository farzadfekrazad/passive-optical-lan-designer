import knex, { Knex } from 'knex';
import path from 'path';
import bcrypt from 'bcryptjs';
import { initialOltDevices, initialOntDevices } from './data/initialData';
import { fileURLToPath } from 'url';

// FIX: `__dirname` is not available in ES modules. This calculates it from `import.meta.url`.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../pol_designer.db');

export const db: Knex = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

export async function initializeDatabase() {
  // Users table
  const hasUsersTable = await db.schema.hasTable('users');
  if (!hasUsersTable) {
    await db.schema.createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('email').unique().notNullable();
      table.string('passwordHash').notNullable();
      table.string('role').notNullable();
      table.boolean('verified').defaultTo(false);
    });

    // Seed admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await db('users').insert({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@pol.designer',
      passwordHash: adminPasswordHash,
      role: 'admin',
      verified: true,
    });
  }

  // Verification codes table
  const hasVerificationCodesTable = await db.schema.hasTable('verification_codes');
  if (!hasVerificationCodesTable) {
    await db.schema.createTable('verification_codes', (table) => {
      table.string('email').primary();
      table.string('code').notNullable();
      table.timestamp('expiresAt').notNullable();
    });
  }

  // OLT Devices table
  const hasOltDevicesTable = await db.schema.hasTable('olts');
  if (!hasOltDevicesTable) {
    await db.schema.createTable('olts', (table) => {
      table.uuid('id').primary();
      table.string('model').notNullable();
      table.text('description');
      table.string('technology').notNullable();
      table.integer('ponPorts').notNullable();
      table.json('uplinkPorts').notNullable();
      table.json('sfpOptions').notNullable();
      table.json('components').notNullable();
    });
    // Seed OLT devices
    await db('olts').insert(initialOltDevices.map(olt => ({
        ...olt,
        uplinkPorts: JSON.stringify(olt.uplinkPorts),
        sfpOptions: JSON.stringify(olt.sfpOptions),
        components: JSON.stringify(olt.components)
    })));
  }

  // ONT Devices table
  const hasOntDevicesTable = await db.schema.hasTable('onts');
  if (!hasOntDevicesTable) {
    await db.schema.createTable('onts', (table) => {
      table.uuid('id').primary();
      table.string('model').notNullable();
      table.text('description');
      table.string('technology').notNullable();
      table.float('rxSensitivity').notNullable();
      table.json('ethernetPorts').notNullable();
      table.integer('fxsPorts').notNullable();
      table.json('wifi');
    });
    // Seed ONT devices
     await db('onts').insert(initialOntDevices.map(ont => ({
        ...ont,
        ethernetPorts: JSON.stringify(ont.ethernetPorts),
        wifi: ont.wifi ? JSON.stringify(ont.wifi) : null
    })));
  }
  
  // Settings table
  const hasSettingsTable = await db.schema.hasTable('settings');
  if(!hasSettingsTable) {
      await db.schema.createTable('settings', (table) => {
          table.string('key').primary();
          table.json('value').notNullable();
      });
  }

  console.log('Database initialized successfully.');
}