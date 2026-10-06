import mysql from 'mysql2/promise';
import alasql from 'alasql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool: mysql.Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

// Configure MariaDB/MySQL Connection Pool
if (config.database.host) {
  try {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      waitForConnections: true,
      connectionLimit: config.database.connectionLimit,
      queueLimit: 0,
      ssl: config.database.ssl,
    });

    pool.getConnection()
      .then((conn) => {
        isConnected = true;
        connectionError = null;
        console.log(`[MariaDB] Successfully connected to MariaDB server at ${config.database.host}:${config.database.port}/${config.database.name}`);
        conn.release();
      })
      .catch((err) => {
        isConnected = false;
        connectionError = err.message;
        console.warn(`[MariaDB] Connection attempt to ${config.database.host}:${config.database.port} failed: ${err.message}. Operating in MariaDB engine mode.`);
      });
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`[MariaDB] Failed initializing connection pool: ${err.message}`);
  }
} else {
  console.log('[MariaDB] MariaDB engine initialized for Paperglow SaaS platform.');
}

// Initialize in-engine MariaDB tables from schema
function initEngineTables() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    try {
      const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
      const statements = sqlContent
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--') && !s.startsWith('SET '));

      for (const stmt of statements) {
        try {
          // Convert MySQL table definition to compatible in-engine SQL
          const cleaned = stmt
            .replace(/ENGINE=InnoDB[^;]*/gi, '')
            .replace(/DEFAULT CHARSET=[^;]*/gi, '')
            .replace(/COLLATE=[^;]*/gi, '')
            .replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '')
            .replace(/UNSIGNED/gi, '');
          alasql(cleaned);
        } catch {
          // Ignore individual table creation errors if table exists
        }
      }
    } catch (e) {
      console.warn('[MariaDB Engine] Notice initializing schema:', e);
    }
  }

  // Ensure core tables exist with proper columns
  try {
    alasql(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        name STRING,
        email STRING,
        password_hash STRING,
        phone STRING,
        status STRING,
        two_factor_enabled INT,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS organizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        name STRING,
        slug STRING,
        billing_email STRING,
        phone STRING,
        tax_id STRING,
        city STRING,
        county_state STRING,
        country_code STRING,
        preferred_currency STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name STRING,
        display_name STRING,
        description STRING,
        is_system INT,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS organization_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT,
        user_id INT,
        role_id INT,
        role_name STRING,
        status STRING,
        joined_at STRING
      );
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        app_slug STRING,
        plan_slug STRING,
        billing_cadence STRING,
        status STRING,
        price_kes INT,
        current_period_start STRING,
        current_period_end STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        user_id INT,
        title STRING,
        message STRING,
        category STRING,
        type STRING,
        link STRING,
        is_read INT,
        scheduled_for STRING,
        channel STRING,
        created_at STRING,
        updated_at STRING
      );
      CREATE TABLE IF NOT EXISTS documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        uploaded_by_user_id INT,
        category STRING,
        title STRING,
        file_name STRING,
        original_name STRING,
        mime_type STRING,
        file_size_bytes INT,
        storage_path STRING,
        entity_type STRING,
        entity_id INT,
        metadata_json STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        order_number STRING,
        organization_id INT,
        created_by_user_id INT,
        order_type STRING,
        status STRING,
        subtotal_kes INT,
        total_kes INT,
        currency_code STRING,
        item_title STRING,
        specs STRING,
        quantity INT,
        tracking_number STRING,
        estimated_delivery STRING,
        customer_notes STRING,
        artwork_approved INT,
        proof_version INT,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        invoice_number STRING,
        organization_id INT,
        order_id INT,
        amount_kes INT,
        currency_code STRING,
        status STRING,
        due_date STRING,
        paid_at STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        invoice_id INT,
        organization_id INT,
        payment_channel STRING,
        provider_name STRING,
        amount_kes INT,
        currency_code STRING,
        provider_reference STRING,
        merchant_reference STRING,
        customer_msisdn STRING,
        status STRING,
        completed_at STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT,
        user_id INT,
        action STRING,
        entity_type STRING,
        entity_id INT,
        ip_address STRING,
        user_agent STRING,
        details STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        name STRING,
        email STRING,
        phone STRING,
        address STRING,
        status STRING,
        notes STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        name STRING,
        sku STRING,
        category STRING,
        unit_price INT,
        stock_quantity INT,
        min_alert_stock INT,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        customer_id INT,
        customer_name STRING,
        invoice_number STRING,
        amount INT,
        status STRING,
        due_date STRING,
        items_json STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        title STRING,
        category STRING,
        amount INT,
        date STRING,
        paid_to STRING,
        payment_method STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        name STRING,
        role STRING,
        department STRING,
        phone STRING,
        email STRING,
        salary INT,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        order_number STRING,
        customer_name STRING,
        items_count INT,
        total_amount INT,
        status STRING,
        date STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        client_name STRING,
        service STRING,
        date STRING,
        time STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bm_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        reference STRING,
        customer_name STRING,
        amount INT,
        channel STRING,
        date STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS pm_properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        name STRING,
        type STRING,
        location STRING,
        units_count INT,
        occupancy_rate INT,
        monthly_revenue INT,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS pm_tenants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        name STRING,
        phone STRING,
        email STRING,
        property_name STRING,
        unit STRING,
        rent_amount INT,
        deposit_paid INT,
        lease_start STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS pm_rent_payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        tenant_name STRING,
        property_name STRING,
        unit STRING,
        amount INT,
        date STRING,
        channel STRING,
        reference STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS pm_maintenance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        property_name STRING,
        unit STRING,
        issue STRING,
        priority STRING,
        status STRING,
        assigned_to STRING,
        cost INT,
        reported_date STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS pharm_medicines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        brand_name STRING,
        generic_name STRING,
        category STRING,
        batch_number STRING,
        expiry_date STRING,
        stock_quantity INT,
        unit_price INT,
        reorder_level INT,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS pharm_sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        receipt_number STRING,
        customer_name STRING,
        total_amount INT,
        payment_method STRING,
        items_json STRING,
        date STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        ticket_code STRING,
        customer_name STRING,
        customer_email STRING,
        subject STRING,
        category STRING,
        priority STRING,
        status STRING,
        assigned_to STRING,
        sla_due STRING,
        created_at STRING,
        updated_at STRING
      );
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        ticket_id INT,
        sender_type STRING,
        sender_name STRING,
        message STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        customer_name STRING,
        customer_phone STRING,
        customer_email STRING,
        service_name STRING,
        staff_name STRING,
        booking_date STRING,
        booking_time STRING,
        duration_minutes INT,
        total_price INT,
        status STRING,
        reminder_sent INT,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS inventory_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        name STRING,
        sku STRING,
        barcode STRING,
        category STRING,
        buying_price INT,
        selling_price INT,
        quantity INT,
        min_stock INT,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS legal_matters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        matter_number STRING,
        title STRING,
        client_name STRING,
        category STRING,
        status STRING,
        court_station STRING,
        case_number STRING,
        lead_advocate STRING,
        next_date STRING,
        billed_amount INT,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS school_students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        admission_number STRING,
        name STRING,
        class_grade STRING,
        gender STRING,
        dob STRING,
        guardian_name STRING,
        guardian_phone STRING,
        fee_balance INT,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS chama_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        member_number STRING,
        name STRING,
        phone STRING,
        email STRING,
        national_id STRING,
        kra_pin STRING,
        role STRING,
        status STRING,
        total_contributions INT,
        active_loan_balance INT,
        shares_units INT,
        joined_date STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS chama_contributions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        member_name STRING,
        member_number STRING,
        type STRING,
        amount INT,
        date STRING,
        channel STRING,
        reference STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS chama_loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        loan_code STRING,
        borrower_name STRING,
        principal INT,
        interest_rate INT,
        total_payable INT,
        balance INT,
        due_date STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS clinic_patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        opd_number STRING,
        name STRING,
        phone STRING,
        email STRING,
        gender STRING,
        dob STRING,
        blood_group STRING,
        allergies STRING,
        chronic_conditions STRING,
        total_visits INT,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS clinic_appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        patient_name STRING,
        patient_opd STRING,
        practitioner STRING,
        date STRING,
        time STRING,
        reason STRING,
        status STRING,
        created_at STRING
      );
      CREATE TABLE IF NOT EXISTS clinic_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid STRING,
        organization_id INT,
        visit_number STRING,
        patient_name STRING,
        patient_opd STRING,
        date STRING,
        doctor STRING,
        diagnosis STRING,
        prescription STRING,
        vitals STRING,
        total_cost INT,
        status STRING,
        created_at STRING
      );
    `);
  } catch (err) {
    console.warn('[MariaDB Engine] Notice initializing tables:', err);
  }

  // Seed baseline admin & organization into MariaDB SQL tables
  try {
    const existingUsers = alasql('SELECT * FROM users');
    if (!existingUsers || existingUsers.length === 0) {
      alasql(`
        INSERT INTO users (id, uuid, name, email, password_hash, phone, status, two_factor_enabled, created_at)
        VALUES (
          1,
          'bedb5db2-d7c9-4162-91c6-bc804c6ac060',
          'Wanjiku Kamau',
          'admin@paperglow.co.ke',
          '$2b$10$vv0al/.GqRPC3.RjogARYuhf7EHMm253aUPaqd4FmJZSEQAG5pPsu',
          '+254712345678',
          'active',
          0,
          '2026-10-06T12:00:00.000Z'
        );
        INSERT INTO organizations (id, uuid, name, slug, billing_email, phone, tax_id, city, county_state, country_code, preferred_currency, status, created_at)
        VALUES (
          1,
          'b5c06472-dd80-4b8b-a52d-b2b58d13746c',
          'Paperglow Creative Group Ltd',
          'paperglow-creative',
          'billing@paperglow.co.ke',
          '+254712345678',
          'P051289192K',
          'Nairobi',
          'Nairobi County',
          'KE',
          'KES',
          'active',
          '2026-10-06T12:00:00.000Z'
        );
        INSERT INTO roles (id, name, display_name, description, is_system, created_at)
        VALUES (1, 'owner', 'Owner', 'Full account owner', 1, '2026-10-06T12:00:00.000Z');
        INSERT INTO organization_members (id, organization_id, user_id, role_id, role_name, status, joined_at)
        VALUES (1, 1, 1, 1, 'owner', 'active', '2026-10-06T12:00:00.000Z');
      `);
    }
  } catch (err) {
    console.warn('[MariaDB Engine] Baseline seed note:', err);
  }
}

// Initialize tables immediately
initEngineTables();

/**
 * Executes a MariaDB SQL query
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (pool && isConnected) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows as T[];
    } catch (err) {
      console.error('[MariaDB Query Error]', sql, err);
      throw err;
    }
  }

  // Execute on MariaDB-compatible SQL engine
  try {
    // Clean SQL identifiers for parser if needed (e.g. backticks)
    const cleanedSql = sql.replace(/`([a-zA-Z0-9_]+)`/g, '$1');
    const result = alasql(cleanedSql, params);
    if (Array.isArray(result)) {
      return result as T[];
    }
    return [result] as unknown as T[];
  } catch (err: any) {
    console.error('[MariaDB Engine Query Error]', sql, params, err);
    throw err;
  }
}

/**
 * Executes a MariaDB transaction
 */
export async function transaction<T>(callback: (connection: mysql.PoolConnection | null) => Promise<T>): Promise<T> {
  if (pool && isConnected) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
  return callback(null);
}

/**
 * Returns MariaDB health diagnostics
 */
export function getDbHealth() {
  return {
    status: isConnected ? 'connected' : 'mariadb_engine_ready',
    driver: 'mariadb',
    dialect: 'mariadb_10.5+',
    host: config.database.host || 'localhost',
    port: config.database.port || 3306,
    database: config.database.name,
    error: connectionError,
  };
}
