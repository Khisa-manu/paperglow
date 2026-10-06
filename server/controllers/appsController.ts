import { Response } from 'express';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../middleware/auth';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';
import { auditService } from '../services/auditService';

export const appsController = {
  /**
   * List subscriptions for current organization
   */
  async listSubscriptions(req: AuthenticatedRequest, res: Response) {
    try {
      const subs = await dbService.find('subscriptions', { organization_id: req.organizationId! });
      return sendSuccess(res, subs);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Subscribe to an application
   */
  async createSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const { appSlug, planSlug = 'professional', priceKes = 3800, billingCadence = 'monthly' } = req.body;
      if (!appSlug) {
        return sendError(res, 'appSlug is required', 400);
      }

      // Check if already active
      let existing = await dbService.findOne('subscriptions', {
        organization_id: req.organizationId!,
        app_slug: appSlug,
      });

      if (existing) {
        existing = await dbService.update('subscriptions', existing.id, {
          status: 'active',
          plan_slug: planSlug,
          price_kes: priceKes,
          billing_cadence: billingCadence,
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        }, req.organizationId!);
        return sendSuccess(res, existing, 'Subscription renewed.');
      }

      const sub = await dbService.create('subscriptions', {
        uuid: crypto.randomUUID(),
        organization_id: req.organizationId!,
        app_slug: appSlug,
        plan_slug: planSlug,
        billing_cadence: billingCadence,
        status: 'active',
        price_kes: priceKes,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      });

      await auditService.log(req, 'subscription.created', 'subscriptions', sub.id, `Subscribed to ${appSlug}`);

      return sendSuccess(res, sub, 'Subscription activated.', 201);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const { appSlug } = req.params;
      const sub = await dbService.findOne('subscriptions', {
        organization_id: req.organizationId!,
        app_slug: appSlug,
      });

      if (!sub) {
        return sendError(res, 'Subscription not found', 404);
      }

      const updated = await dbService.update('subscriptions', sub.id, { status: 'canceled' }, req.organizationId!);
      await auditService.log(req, 'subscription.canceled', 'subscriptions', sub.id, `Canceled ${appSlug}`);

      return sendSuccess(res, updated, 'Subscription canceled.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * List orders (merchandise & software)
   */
  async listOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await dbService.find('orders', { organization_id: req.organizationId! }, { orderBy: 'id', orderDirection: 'DESC' });
      return sendSuccess(res, orders);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Create an order
   */
  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { itemTitle, specs, quantity = 1, totalKes, customerNotes } = req.body;
      const orderNumber = `PG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

      const order = await dbService.create('orders', {
        uuid: crypto.randomUUID(),
        order_number: orderNumber,
        organization_id: req.organizationId!,
        created_by_user_id: req.user!.userId,
        order_type: 'merchandise',
        status: 'processing',
        subtotal_kes: totalKes,
        total_kes: totalKes,
        currency_code: 'KES',
        item_title: itemTitle,
        specs: specs || '',
        quantity,
        customer_notes: customerNotes || null,
        artwork_approved: 0,
        proof_version: 1,
        estimated_delivery: '3-5 business days',
      });

      await auditService.log(req, 'order.created', 'orders', order.id, `Created order ${orderNumber}`);

      return sendSuccess(res, order, 'Order submitted successfully.', 201);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Approve proof
   */
  async approveProof(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await dbService.findById('orders', req.params.orderId, req.organizationId!);
      if (!order) {
        return sendError(res, 'Order not found', 404);
      }

      const updated = await dbService.update('orders', order.id, {
        artwork_approved: 1,
        status: 'in_production',
      }, req.organizationId!);

      await auditService.log(req, 'proof.approved', 'orders', order.id, `Proof approved for order ${order.order_number}`);

      return sendSuccess(res, updated, 'Proof approved and moved to production.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Request proof revision
   */
  async requestRevision(req: AuthenticatedRequest, res: Response) {
    try {
      const { feedback } = req.body;
      const order = await dbService.findById('orders', req.params.orderId, req.organizationId!);
      if (!order) {
        return sendError(res, 'Order not found', 404);
      }

      const updated = await dbService.update('orders', order.id, {
        proof_version: (order.proof_version || 1) + 1,
        status: 'proofing',
        customer_notes: feedback,
      }, req.organizationId!);

      await auditService.log(req, 'proof.revision_requested', 'orders', order.id, `Proof revision requested: ${feedback}`);

      return sendSuccess(res, updated, 'Revision request logged.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Get billing invoices & payments
   */
  async getBillingInvoices(req: AuthenticatedRequest, res: Response) {
    try {
      const invoices = await dbService.find('invoices', { organization_id: req.organizationId! });
      const payments = await dbService.find('payments', { organization_id: req.organizationId! });
      return sendSuccess(res, {
        invoices,
        payments,
        currency: 'KES',
      });
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * Pay invoice
   */
  async payInvoice(req: AuthenticatedRequest, res: Response) {
    try {
      const { invoiceId, channel = 'mobile_money', phone } = req.body;
      const invoice = await dbService.findById('invoices', invoiceId, req.organizationId!);
      if (!invoice) {
        return sendError(res, 'Invoice not found', 404);
      }

      const mpesaRef = `QG${Math.random().toString(36).substring(2, 8).toUpperCase()}K`;
      const payment = await dbService.create('payments', {
        uuid: crypto.randomUUID(),
        invoice_id: invoice.id,
        organization_id: req.organizationId!,
        payment_channel: channel,
        provider_name: channel === 'mobile_money' ? 'mpesa' : 'card_gateway',
        amount_kes: invoice.amount_kes,
        currency_code: 'KES',
        provider_reference: mpesaRef,
        merchant_reference: `PG-PAY-${invoice.invoice_number}`,
        customer_msisdn: phone || null,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

      await dbService.update('invoices', invoice.id, {
        status: 'paid',
        paid_at: new Date().toISOString(),
      }, req.organizationId!);

      await auditService.log(req, 'invoice.paid', 'invoices', invoice.id, `Invoice paid via ${channel} (${mpesaRef})`);

      return sendSuccess(res, payment, `Payment processed successfully. Reference: ${mpesaRef}`);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },
};
