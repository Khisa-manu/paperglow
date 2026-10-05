-- ============================================================================
-- PAPERGLOW PLATFORM — DIRECTADMIN MYSQL / MARIADB PRODUCTION SCHEMA
-- Country Default: Kenya (KE) | Currency Default: KES (Kenyan Shilling)
-- Compatible with MySQL 8.0+ and MariaDB 10.5+ (Standard DirectAdmin Hosting)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `oauth_auth_codes`;
DROP TABLE IF EXISTS `oauth_access_tokens`;
DROP TABLE IF EXISTS `oauth_clients`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `proofs`;
DROP TABLE IF EXISTS `artwork_files`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `branding_products`;
DROP TABLE IF EXISTS `entitlements`;
DROP TABLE IF EXISTS `subscriptions`;
DROP TABLE IF EXISTS `application_plans`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `organization_members`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `organizations`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `currencies`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. CURRENCIES & LOCALIZATION
-- ----------------------------------------------------------------------------
CREATE TABLE `currencies` (
  `code` CHAR(3) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `symbol` VARCHAR(10) NOT NULL,
  `decimal_precision` TINYINT UNSIGNED NOT NULL DEFAULT 2,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `currencies` (`code`, `name`, `symbol`, `decimal_precision`, `is_active`, `is_default`) VALUES
('KES', 'Kenyan Shilling', 'KSh', 2, 1, 1),
('USD', 'US Dollar', '$', 2, 1, 0),
('EUR', 'Euro', '€', 2, 1, 0),
('GBP', 'British Pound', '£', 2, 1, 0);

-- ----------------------------------------------------------------------------
-- 2. USERS & ORGANIZATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL DEFAULT NULL,
  `avatar_url` VARCHAR(2048) NULL DEFAULT NULL,
  `two_factor_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('active', 'suspended', 'pending_verification') NOT NULL DEFAULT 'active',
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `organizations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `billing_email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NULL DEFAULT NULL,
  `tax_id` VARCHAR(100) NULL DEFAULT NULL,     -- e.g. KRA PIN
  `address_line1` VARCHAR(255) NULL DEFAULT NULL,
  `address_line2` VARCHAR(255) NULL DEFAULT NULL,
  `city` VARCHAR(100) NULL DEFAULT 'Nairobi',
  `county_state` VARCHAR(100) NULL DEFAULT 'Nairobi',
  `postal_code` VARCHAR(30) NULL DEFAULT NULL,
  `country_code` CHAR(2) NOT NULL DEFAULT 'KE',
  `preferred_currency` CHAR(3) NOT NULL DEFAULT 'KES',
  `status` ENUM('active', 'past_due', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`preferred_currency`) REFERENCES `currencies` (`code`),
  INDEX `idx_orgs_slug` (`slug`),
  INDEX `idx_orgs_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`name`, `display_name`, `description`) VALUES
('owner', 'Organization Owner', 'Full administrative authority and ownership control'),
('admin', 'Administrator', 'Can manage apps, subscriptions, team members and billing'),
('billing_manager', 'Billing Manager', 'Can approve payments, view invoices and manage card/M-Pesa details'),
('member', 'Team Member', 'Standard application user with read-only billing privileges');

CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`name`, `description`) VALUES
('apps.view', 'View applications and details'),
('apps.subscribe', 'Subscribe to applications'),
('apps.cancel', 'Cancel existing subscriptions'),
('orders.view', 'View organization merchandise and billing orders'),
('orders.create', 'Place custom branding and merchandise orders'),
('proofs.approve', 'Approve pre-press production artwork proofs'),
('proofs.revision', 'Request revisions on artwork proofs'),
('billing.view', 'View invoices and payment receipts'),
('billing.pay', 'Initiate M-Pesa or Card payments'),
('team.manage', 'Invite or remove organization team members'),
('audit.view', 'View organization security audit trail');

CREATE TABLE `role_permissions` (
  `role_id` BIGINT UNSIGNED NOT NULL,
  `permission_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Give owner all permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, `id` FROM `permissions`;

-- Give admin all permissions except billing critical overrides
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, `id` FROM `permissions`;

CREATE TABLE `organization_members` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `role_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('active', 'invited', 'disabled') NOT NULL DEFAULT 'active',
  `joined_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_org_user` (`organization_id`, `user_id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. APPLICATIONS, PLANS & ENTITLEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE `applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `short_description` TEXT NOT NULL,
  `description` LONGTEXT NOT NULL,
  `main_benefit` TEXT NOT NULL,
  `category` ENUM('Finance & Payments', 'Sales & CRM', 'Projects & Work', 'Organization & HR', 'Operations & Support') NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL,
  `version` VARCHAR(20) NOT NULL DEFAULT 'v1.0',
  `app_launch_url` VARCHAR(2048) NULL DEFAULT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_apps_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `application_plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `application_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `monthly_price_kes` BIGINT UNSIGNED NOT NULL, -- Stored in whole KES or minor units
  `annual_price_kes` BIGINT UNSIGNED NOT NULL,
  `currency_code` CHAR(3) NOT NULL DEFAULT 'KES',
  `description` VARCHAR(255) NOT NULL,
  `seat_limit` INT UNSIGNED NULL DEFAULT NULL,
  `features_json` JSON NOT NULL,
  `is_popular` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_app_plan_slug` (`application_id`, `slug`),
  FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`currency_code`) REFERENCES `currencies` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `subscriptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `application_id` BIGINT UNSIGNED NOT NULL,
  `application_plan_id` BIGINT UNSIGNED NOT NULL,
  `billing_cadence` ENUM('monthly', 'annual') NOT NULL DEFAULT 'monthly',
  `status` ENUM('trialing', 'active', 'past_due', 'canceled', 'suspended') NOT NULL DEFAULT 'active',
  `current_period_start` TIMESTAMP NOT NULL,
  `current_period_end` TIMESTAMP NOT NULL,
  `canceled_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  FOREIGN KEY (`application_plan_id`) REFERENCES `application_plans` (`id`),
  INDEX `idx_sub_org_status` (`organization_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entitlements` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `application_id` BIGINT UNSIGNED NOT NULL,
  `subscription_id` BIGINT UNSIGNED NOT NULL,
  `feature_key` VARCHAR(100) NOT NULL,
  `value` VARCHAR(191) NOT NULL DEFAULT 'true',
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_org_app_feature` (`organization_id`, `application_id`, `feature_key`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. BRANDING PRODUCTS, ORDERS, ARTWORK & PROOFS
-- ----------------------------------------------------------------------------
CREATE TABLE `branding_products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(191) NOT NULL,
  `category` ENUM('Creative Design', 'Signage & Displays', 'Custom Apparel', 'Workwear & Uniforms', 'Print Collateral', 'Merchandise & Swag') NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `base_price_kes` BIGINT UNSIGNED NOT NULL,
  `currency_code` CHAR(3) NOT NULL DEFAULT 'KES',
  `price_unit` VARCHAR(50) NOT NULL,
  `min_order_qty` INT UNSIGNED NOT NULL DEFAULT 1,
  `turnaround_text` VARCHAR(100) NOT NULL,
  `materials` VARCHAR(255) NOT NULL,
  `specs_json` JSON NOT NULL,
  `variations_json` JSON NOT NULL,
  `bulk_discounts_json` JSON NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`currency_code`) REFERENCES `currencies` (`code`),
  INDEX `idx_brand_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `created_by_user_id` BIGINT UNSIGNED NOT NULL,
  `order_type` ENUM('software_subscription', 'merchandise') NOT NULL,
  `status` ENUM('pending_payment', 'processing', 'proofing', 'in_production', 'shipped', 'delivered', 'canceled') NOT NULL DEFAULT 'processing',
  `subtotal_kes` BIGINT UNSIGNED NOT NULL,
  `discount_kes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `tax_kes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `shipping_kes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `total_kes` BIGINT UNSIGNED NOT NULL,
  `currency_code` CHAR(3) NOT NULL DEFAULT 'KES',
  `tracking_number` VARCHAR(100) NULL DEFAULT NULL,
  `carrier_name` VARCHAR(50) NULL DEFAULT NULL,
  `estimated_delivery` VARCHAR(100) NULL DEFAULT NULL,
  `customer_notes` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`currency_code`) REFERENCES `currencies` (`code`),
  INDEX `idx_orders_org` (`organization_id`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `item_type` ENUM('application_plan', 'branding_product') NOT NULL,
  `application_plan_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `branding_product_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `item_title` VARCHAR(191) NOT NULL,
  `selected_variations_json` JSON NULL DEFAULT NULL,
  `unit_price_kes` BIGINT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `line_total_kes` BIGINT UNSIGNED NOT NULL,
  `customization_notes` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`application_plan_id`) REFERENCES `application_plans` (`id`),
  FOREIGN KEY (`branding_product_id`) REFERENCES `branding_products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `artwork_files` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `uploaded_by_user_id` BIGINT UNSIGNED NOT NULL,
  `order_item_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `original_file_name` VARCHAR(255) NOT NULL,
  `storage_path` VARCHAR(512) NOT NULL,
  `file_size_bytes` BIGINT UNSIGNED NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_extension` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `proofs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `order_item_id` BIGINT UNSIGNED NOT NULL,
  `proof_version` INT UNSIGNED NOT NULL DEFAULT 1,
  `proof_file_path` VARCHAR(512) NOT NULL,
  `status` ENUM('pending_review', 'approved', 'revision_requested') NOT NULL DEFAULT 'pending_review',
  `customer_feedback` TEXT NULL DEFAULT NULL,
  `approved_by_user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `approved_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. INVOICES, PAYMENTS & AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE `invoices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `subscription_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `amount_kes` BIGINT UNSIGNED NOT NULL,
  `tax_kes` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `currency_code` CHAR(3) NOT NULL DEFAULT 'KES',
  `status` ENUM('draft', 'open', 'paid', 'void', 'uncollectible') NOT NULL DEFAULT 'open',
  `due_date` DATE NOT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `pdf_storage_path` VARCHAR(512) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`currency_code`) REFERENCES `currencies` (`code`),
  INDEX `idx_invoices_org` (`organization_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `invoice_id` BIGINT UNSIGNED NOT NULL,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `payment_channel` ENUM('mobile_money', 'card', 'bank_transfer', 'account_credit') NOT NULL,
  `provider_name` VARCHAR(50) NOT NULL,            -- 'mpesa', 'card_gateway', 'bank_eft'
  `amount_kes` BIGINT UNSIGNED NOT NULL,
  `currency_code` CHAR(3) NOT NULL DEFAULT 'KES',
  `provider_reference` VARCHAR(191) NULL DEFAULT NULL, -- e.g. M-Pesa receipt code
  `merchant_reference` VARCHAR(191) NOT NULL,      -- Paperglow checkout ref
  `customer_msisdn` VARCHAR(30) NULL DEFAULT NULL, -- Phone for STK Push
  `status` ENUM('pending', 'completed', 'failed', 'refunded', 'reversed') NOT NULL DEFAULT 'pending',
  `provider_metadata` JSON NULL DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`),
  INDEX `idx_pay_provider_ref` (`provider_name`, `provider_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) NULL DEFAULT NULL,
  `payload_json` JSON NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_org_action` (`organization_id`, `action`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. PHASE 3 SSO & OAUTH2 EXTENSION (PREPARED FOR FUTURE SUB-APPS)
-- ----------------------------------------------------------------------------
CREATE TABLE `oauth_clients` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` VARCHAR(100) NOT NULL UNIQUE,       -- e.g. 'client_invoice_app'
  `name` VARCHAR(191) NOT NULL,
  `secret` VARCHAR(255) NOT NULL,
  `redirect_uris` TEXT NOT NULL,                  -- Comma-separated or JSON array of valid callback URLs
  `is_confidential` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_oauth_client_id` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `oauth_clients` (`client_id`, `name`, `secret`, `redirect_uris`) VALUES
('client_pg_invoice', 'Paperglow Invoice Sub-App', 'sec_inv_772189491', 'https://invoice.paperglow.com/auth/callback,http://localhost:3001/auth/callback'),
('client_pg_crm', 'Paperglow CRM Sub-App', 'sec_crm_994182471', 'https://crm.paperglow.com/auth/callback,http://localhost:3002/auth/callback'),
('client_pg_hub', 'Paperglow Hub Sub-App', 'sec_hub_331829471', 'https://hub.paperglow.com/auth/callback,http://localhost:3003/auth/callback');

CREATE TABLE `oauth_auth_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(128) NOT NULL UNIQUE,
  `client_id` VARCHAR(100) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `scopes` VARCHAR(255) NOT NULL DEFAULT 'openid profile entitlements',
  `expires_at` TIMESTAMP NOT NULL,
  `is_revoked` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `oauth_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `token_id` VARCHAR(128) NOT NULL UNIQUE,
  `client_id` VARCHAR(100) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `organization_id` BIGINT UNSIGNED NOT NULL,
  `scopes` VARCHAR(255) NOT NULL DEFAULT 'openid profile entitlements',
  `expires_at` TIMESTAMP NOT NULL,
  `is_revoked` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
