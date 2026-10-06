import { dbService } from '../services/dbService';
import { hashPassword } from '../utils/password';
import crypto from 'crypto';

async function seed() {
  console.log('[Seeder] Initializing baseline platform records...');

  // 1. Roles
  const roles = [
    { name: 'owner', display_name: 'Owner', description: 'Full account and billing ownership', is_system: 1 },
    { name: 'admin', display_name: 'Administrator', description: 'Full access to organization applications and settings', is_system: 1 },
    { name: 'billing_manager', display_name: 'Billing Manager', description: 'Manage subscriptions, invoices and payments', is_system: 1 },
    { name: 'member', display_name: 'Member', description: 'Standard application user', is_system: 1 },
  ];

  for (const r of roles) {
    const existing = await dbService.findOne('roles', { name: r.name });
    if (!existing) {
      await dbService.create('roles', r);
    }
  }

  // 2. Initial Admin User if none exists
  const existingUsers = await dbService.find('users');
  if (existingUsers.length === 0) {
    const passwordHash = await hashPassword('Paperglow@2026');
    const user = await dbService.create('users', {
      uuid: crypto.randomUUID(),
      name: 'Wanjiku Kamau',
      email: 'admin@paperglow.co.ke',
      password_hash: passwordHash,
      phone: '+254712345678',
      two_factor_enabled: 0,
      status: 'active',
    });

    const org = await dbService.create('organizations', {
      uuid: crypto.randomUUID(),
      name: 'Paperglow Creative Group Ltd',
      slug: 'paperglow-creative',
      billing_email: 'billing@paperglow.co.ke',
      phone: '+254712345678',
      tax_id: 'P051289192K',
      city: 'Nairobi',
      county_state: 'Nairobi County',
      country_code: 'KE',
      preferred_currency: 'KES',
      status: 'active',
    });

    const ownerRole = await dbService.findOne('roles', { name: 'owner' });
    await dbService.create('organization_members', {
      organization_id: org.id,
      user_id: user.id,
      role_id: ownerRole ? ownerRole.id : null,
      role_name: 'owner',
      status: 'active',
    });

    // Subscriptions
    const defaultApps = [
      'paperglow-business-manager',
      'paperglow-property-manager',
      'paperglow-pharmacy-manager',
      'paperglow-ticketing',
      'paperglow-booking',
      'paperglow-stock-inventory',
      'paperglow-legal-practice',
      'paperglow-school-manager',
      'paperglow-chama-manager',
      'paperglow-clinic-manager',
    ];

    for (const appSlug of defaultApps) {
      await dbService.create('subscriptions', {
        uuid: crypto.randomUUID(),
        organization_id: org.id,
        app_slug: appSlug,
        plan_slug: 'professional',
        billing_cadence: 'monthly',
        status: 'active',
        price_kes: 3800,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      });
    }

    console.log('✅ Baseline Admin & Organization provisioned successfully.');
  }

  console.log('✅ Seeding completed.');
}

seed().catch((err) => {
  console.error('[Seeder Failed]', err);
});
