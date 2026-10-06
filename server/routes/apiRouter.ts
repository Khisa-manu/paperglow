import { Router } from 'express';
import multer from 'multer';
import { healthController } from '../controllers/healthController';
import { authController } from '../controllers/authController';
import { orgController } from '../controllers/orgController';
import { notificationController } from '../controllers/notificationController';
import { documentController } from '../controllers/documentController';
import { appsController } from '../controllers/appsController';
import { businessController } from '../controllers/businessController';
import { propertyController } from '../controllers/propertyController';
import { pharmacyController } from '../controllers/pharmacyController';
import { ticketingController } from '../controllers/ticketingController';
import { bookingController } from '../controllers/bookingController';
import { inventoryController } from '../controllers/inventoryController';
import { legalController } from '../controllers/legalController';
import { schoolController } from '../controllers/schoolController';
import { chamaController } from '../controllers/chamaController';
import { clinicController } from '../controllers/clinicController';
import { partyController } from '../controllers/partyController';
import { invoiceDocController } from '../controllers/invoiceDocController';
import { requireAuth } from '../middleware/auth';
import { requireOrgContext } from '../middleware/orgContext';

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // in-memory buffer for storageService

export const apiRouter = Router();

// ============================================================================
// 1. HEALTH & SYSTEM
// ============================================================================
apiRouter.get('/health', healthController.check);

// ============================================================================
// 2. AUTHENTICATION & SESSIONS
// ============================================================================
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.post('/auth/logout', authController.logout);
apiRouter.get('/auth/me', requireAuth, authController.me);
apiRouter.post('/auth/switch-org', requireAuth, authController.switchOrg);
apiRouter.put('/auth/profile', requireAuth, authController.updateProfile);

// ============================================================================
// 3. ORGANIZATIONS & MEMBERSHIP (MULTI-TENANT)
// ============================================================================
apiRouter.get('/organizations/current', requireAuth, requireOrgContext, orgController.getCurrent);
apiRouter.put('/organizations/current', requireAuth, requireOrgContext, orgController.updateCurrent);
apiRouter.get('/organizations/members', requireAuth, requireOrgContext, orgController.listMembers);
apiRouter.post('/organizations/members/invite', requireAuth, requireOrgContext, orgController.inviteMember);

// ============================================================================
// 4. NOTIFICATIONS
// ============================================================================
apiRouter.get('/notifications', requireAuth, requireOrgContext, notificationController.list);
apiRouter.patch('/notifications/:id/read', requireAuth, requireOrgContext, notificationController.markRead);
apiRouter.post('/notifications/mark-all-read', requireAuth, requireOrgContext, notificationController.markAllRead);
apiRouter.post('/notifications', requireAuth, requireOrgContext, notificationController.create);

// ============================================================================
// 5. DOCUMENTS & STORAGE
// ============================================================================
apiRouter.get('/documents', requireAuth, requireOrgContext, documentController.list);
apiRouter.post('/documents/upload', requireAuth, requireOrgContext, upload.single('file'), documentController.upload);
apiRouter.get('/documents/:id/download', requireAuth, requireOrgContext, documentController.download);
apiRouter.delete('/documents/:id', requireAuth, requireOrgContext, documentController.delete);

// ============================================================================
// 6. APPS, SUBSCRIPTIONS & MERCHANDISE BILLING
// ============================================================================
apiRouter.get('/subscriptions', requireAuth, requireOrgContext, appsController.listSubscriptions);
apiRouter.post('/subscriptions', requireAuth, requireOrgContext, appsController.createSubscription);
apiRouter.delete('/subscriptions/:appSlug', requireAuth, requireOrgContext, appsController.cancelSubscription);
apiRouter.get('/orders', requireAuth, requireOrgContext, appsController.listOrders);
apiRouter.post('/orders', requireAuth, requireOrgContext, appsController.createOrder);
apiRouter.post('/proofs/:orderId/approve', requireAuth, requireOrgContext, appsController.approveProof);
apiRouter.post('/proofs/:orderId/revision', requireAuth, requireOrgContext, appsController.requestRevision);
apiRouter.get('/billing/invoices', requireAuth, requireOrgContext, appsController.getBillingInvoices);
apiRouter.post('/billing/pay', requireAuth, requireOrgContext, appsController.payInvoice);

// Artwork upload endpoint
apiRouter.post('/artwork/upload', requireAuth, requireOrgContext, upload.single('artwork'), async (req, res) => {
  const file = (req as any).file;
  if (!file) return res.status(400).json({ success: false, message: 'No artwork file provided' });
  const doc = await documentController.upload(req as any, res as any);
  return doc;
});

// OAuth 2.0 / SSO Endpoints
apiRouter.post('/oauth/authorize', requireAuth, requireOrgContext, (req: any, res) => {
  const { appSlug } = req.body;
  const authCode = `auth_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
  return res.json({
    success: true,
    data: {
      authCode,
      appSlug,
      redirectUri: `https://${appSlug}.paperglow.co.ke/auth/callback`,
      expiresInSeconds: 600,
    },
  });
});

apiRouter.post('/oauth/token', requireAuth, (req: any, res) => {
  const { code } = req.body;
  return res.json({
    access_token: `at_${code}_token`,
    token_type: 'Bearer',
    user_info: req.user,
  });
});

apiRouter.get('/oauth/verify', requireAuth, (req: any, res) => {
  return res.json({ active: true, claims: req.user });
});

// ============================================================================
// 7. BUSINESS MANAGER
// ============================================================================
apiRouter.get('/business/customers', requireAuth, requireOrgContext, businessController.getCustomers);
apiRouter.post('/business/customers', requireAuth, requireOrgContext, businessController.createCustomer);
apiRouter.put('/business/customers/:id', requireAuth, requireOrgContext, businessController.updateCustomer);
apiRouter.delete('/business/customers/:id', requireAuth, requireOrgContext, businessController.deleteCustomer);

apiRouter.get('/business/products', requireAuth, requireOrgContext, businessController.getProducts);
apiRouter.post('/business/products', requireAuth, requireOrgContext, businessController.createProduct);

apiRouter.get('/business/invoices', requireAuth, requireOrgContext, businessController.getInvoices);
apiRouter.post('/business/invoices', requireAuth, requireOrgContext, businessController.createInvoice);

apiRouter.get('/business/expenses', requireAuth, requireOrgContext, businessController.getExpenses);
apiRouter.post('/business/expenses', requireAuth, requireOrgContext, businessController.createExpense);

apiRouter.get('/business/employees', requireAuth, requireOrgContext, businessController.getEmployees);
apiRouter.post('/business/employees', requireAuth, requireOrgContext, businessController.createEmployee);

apiRouter.get('/business/orders', requireAuth, requireOrgContext, businessController.getOrders);
apiRouter.post('/business/orders', requireAuth, requireOrgContext, businessController.createOrder);

apiRouter.get('/business/appointments', requireAuth, requireOrgContext, businessController.getAppointments);
apiRouter.post('/business/appointments', requireAuth, requireOrgContext, businessController.createAppointment);

apiRouter.get('/business/payments', requireAuth, requireOrgContext, businessController.getPayments);
apiRouter.post('/business/payments', requireAuth, requireOrgContext, businessController.createPayment);

// ============================================================================
// 8. PROPERTY MANAGER
// ============================================================================
apiRouter.get('/property/properties', requireAuth, requireOrgContext, propertyController.getProperties);
apiRouter.post('/property/properties', requireAuth, requireOrgContext, propertyController.createProperty);
apiRouter.delete('/property/properties/:id', requireAuth, requireOrgContext, propertyController.deleteProperty);

apiRouter.get('/property/tenants', requireAuth, requireOrgContext, propertyController.getTenants);
apiRouter.post('/property/tenants', requireAuth, requireOrgContext, propertyController.createTenant);
apiRouter.delete('/property/tenants/:id', requireAuth, requireOrgContext, propertyController.deleteTenant);

apiRouter.get('/property/rent-payments', requireAuth, requireOrgContext, propertyController.getRentPayments);
apiRouter.post('/property/rent-payments', requireAuth, requireOrgContext, propertyController.createRentPayment);

apiRouter.get('/property/maintenance', requireAuth, requireOrgContext, propertyController.getMaintenance);
apiRouter.post('/property/maintenance', requireAuth, requireOrgContext, propertyController.createMaintenance);
apiRouter.put('/property/maintenance/:id', requireAuth, requireOrgContext, propertyController.updateMaintenance);

apiRouter.get('/property/expenses', requireAuth, requireOrgContext, propertyController.getExpenses);
apiRouter.post('/property/expenses', requireAuth, requireOrgContext, propertyController.createExpense);

// ============================================================================
// 9. PHARMACY MANAGER
// ============================================================================
apiRouter.get('/pharmacy/medicines', requireAuth, requireOrgContext, pharmacyController.getMedicines);
apiRouter.post('/pharmacy/medicines', requireAuth, requireOrgContext, pharmacyController.createMedicine);
apiRouter.put('/pharmacy/medicines/:id', requireAuth, requireOrgContext, pharmacyController.updateMedicine);

apiRouter.get('/pharmacy/sales', requireAuth, requireOrgContext, pharmacyController.getSales);
apiRouter.post('/pharmacy/sales', requireAuth, requireOrgContext, pharmacyController.createSale);

apiRouter.get('/pharmacy/movements', requireAuth, requireOrgContext, pharmacyController.getMovements);
apiRouter.post('/pharmacy/movements', requireAuth, requireOrgContext, pharmacyController.createMovement);

apiRouter.get('/pharmacy/suppliers', requireAuth, requireOrgContext, pharmacyController.getSuppliers);
apiRouter.post('/pharmacy/suppliers', requireAuth, requireOrgContext, pharmacyController.createSupplier);

// ============================================================================
// 10. TICKETING SYSTEM
// ============================================================================
apiRouter.get('/ticketing/tickets', requireAuth, requireOrgContext, ticketingController.getTickets);
apiRouter.post('/ticketing/tickets', requireAuth, requireOrgContext, ticketingController.createTicket);
apiRouter.put('/ticketing/tickets/:id', requireAuth, requireOrgContext, ticketingController.updateTicket);
apiRouter.get('/ticketing/tickets/:ticketId/messages', requireAuth, requireOrgContext, ticketingController.getMessages);
apiRouter.post('/ticketing/tickets/:ticketId/messages', requireAuth, requireOrgContext, ticketingController.addMessage);

// ============================================================================
// 11. BOOKING SYSTEM
// ============================================================================
apiRouter.get('/booking/bookings', requireAuth, requireOrgContext, bookingController.getBookings);
apiRouter.post('/booking/bookings', requireAuth, requireOrgContext, bookingController.createBooking);
apiRouter.put('/booking/bookings/:id', requireAuth, requireOrgContext, bookingController.updateBooking);
apiRouter.delete('/booking/bookings/:id', requireAuth, requireOrgContext, bookingController.deleteBooking);

apiRouter.get('/booking/customers', requireAuth, requireOrgContext, bookingController.getCustomers);
apiRouter.post('/booking/customers', requireAuth, requireOrgContext, bookingController.createCustomer);

apiRouter.get('/booking/services', requireAuth, requireOrgContext, bookingController.getServices);
apiRouter.post('/booking/services', requireAuth, requireOrgContext, bookingController.createService);

apiRouter.get('/booking/staff', requireAuth, requireOrgContext, bookingController.getStaff);
apiRouter.post('/booking/staff', requireAuth, requireOrgContext, bookingController.createStaff);

apiRouter.get('/booking/payments', requireAuth, requireOrgContext, bookingController.getPayments);
apiRouter.post('/booking/payments', requireAuth, requireOrgContext, bookingController.createPayment);

// ============================================================================
// 12. INVENTORY SYSTEM
// ============================================================================
apiRouter.get('/inventory/products', requireAuth, requireOrgContext, inventoryController.getProducts);
apiRouter.post('/inventory/products', requireAuth, requireOrgContext, inventoryController.createProduct);
apiRouter.put('/inventory/products/:id', requireAuth, requireOrgContext, inventoryController.updateProduct);
apiRouter.delete('/inventory/products/:id', requireAuth, requireOrgContext, inventoryController.deleteProduct);

apiRouter.get('/inventory/movements', requireAuth, requireOrgContext, inventoryController.getMovements);
apiRouter.post('/inventory/movements', requireAuth, requireOrgContext, inventoryController.createMovement);

apiRouter.get('/inventory/suppliers', requireAuth, requireOrgContext, inventoryController.getSuppliers);
apiRouter.post('/inventory/suppliers', requireAuth, requireOrgContext, inventoryController.createSupplier);

// ============================================================================
// 13. LEGAL PRACTICE MANAGER
// ============================================================================
apiRouter.get('/legal/matters', requireAuth, requireOrgContext, legalController.getMatters);
apiRouter.post('/legal/matters', requireAuth, requireOrgContext, legalController.createMatter);
apiRouter.put('/legal/matters/:id', requireAuth, requireOrgContext, legalController.updateMatter);

apiRouter.get('/legal/clients', requireAuth, requireOrgContext, legalController.getClients);
apiRouter.post('/legal/clients', requireAuth, requireOrgContext, legalController.createClient);

apiRouter.get('/legal/hearings', requireAuth, requireOrgContext, legalController.getHearings);
apiRouter.post('/legal/hearings', requireAuth, requireOrgContext, legalController.createHearing);

apiRouter.get('/legal/time-entries', requireAuth, requireOrgContext, legalController.getTimeEntries);
apiRouter.post('/legal/time-entries', requireAuth, requireOrgContext, legalController.createTimeEntry);

// ============================================================================
// 14. SCHOOL MANAGER
// ============================================================================
apiRouter.get('/school/students', requireAuth, requireOrgContext, schoolController.getStudents);
apiRouter.post('/school/students', requireAuth, requireOrgContext, schoolController.createStudent);
apiRouter.put('/school/students/:id', requireAuth, requireOrgContext, schoolController.updateStudent);
apiRouter.delete('/school/students/:id', requireAuth, requireOrgContext, schoolController.deleteStudent);

apiRouter.get('/school/classes', requireAuth, requireOrgContext, schoolController.getClasses);
apiRouter.post('/school/classes', requireAuth, requireOrgContext, schoolController.createClass);

apiRouter.get('/school/teachers', requireAuth, requireOrgContext, schoolController.getTeachers);
apiRouter.post('/school/teachers', requireAuth, requireOrgContext, schoolController.createTeacher);

apiRouter.get('/school/fee-payments', requireAuth, requireOrgContext, schoolController.getFeePayments);
apiRouter.post('/school/fee-payments', requireAuth, requireOrgContext, schoolController.createFeePayment);

// ============================================================================
// 15. CHAMA MANAGER
// ============================================================================
apiRouter.get('/chama/members', requireAuth, requireOrgContext, chamaController.getMembers);
apiRouter.post('/chama/members', requireAuth, requireOrgContext, chamaController.createMember);
apiRouter.put('/chama/members/:id', requireAuth, requireOrgContext, chamaController.updateMember);

apiRouter.get('/chama/contributions', requireAuth, requireOrgContext, chamaController.getContributions);
apiRouter.post('/chama/contributions', requireAuth, requireOrgContext, chamaController.createContribution);

apiRouter.get('/chama/loans', requireAuth, requireOrgContext, chamaController.getLoans);
apiRouter.post('/chama/loans', requireAuth, requireOrgContext, chamaController.createLoan);

apiRouter.get('/chama/group', requireAuth, requireOrgContext, chamaController.getGroup);
apiRouter.put('/chama/group', requireAuth, requireOrgContext, chamaController.updateGroup);

// ============================================================================
// 16. CLINIC MANAGER
// ============================================================================
apiRouter.get('/clinic/patients', requireAuth, requireOrgContext, clinicController.getPatients);
apiRouter.post('/clinic/patients', requireAuth, requireOrgContext, clinicController.createPatient);
apiRouter.put('/clinic/patients/:id', requireAuth, requireOrgContext, clinicController.updatePatient);

apiRouter.get('/clinic/appointments', requireAuth, requireOrgContext, clinicController.getAppointments);
apiRouter.post('/clinic/appointments', requireAuth, requireOrgContext, clinicController.createAppointment);

apiRouter.get('/clinic/visits', requireAuth, requireOrgContext, clinicController.getVisits);
apiRouter.post('/clinic/visits', requireAuth, requireOrgContext, clinicController.createVisit);

// ============================================================================
// 17. PARTY MANAGER
// ============================================================================
apiRouter.get('/party/members', requireAuth, requireOrgContext, partyController.getMembers);
apiRouter.post('/party/members', requireAuth, requireOrgContext, partyController.createMember);
apiRouter.put('/party/members/:id', requireAuth, requireOrgContext, partyController.updateMember);
apiRouter.delete('/party/members/:id', requireAuth, requireOrgContext, partyController.deleteMember);

apiRouter.get('/party/branches', requireAuth, requireOrgContext, partyController.getBranches);
apiRouter.post('/party/branches', requireAuth, requireOrgContext, partyController.createBranch);

apiRouter.get('/party/events', requireAuth, requireOrgContext, partyController.getEvents);
apiRouter.post('/party/events', requireAuth, requireOrgContext, partyController.createEvent);

apiRouter.get('/party/finance', requireAuth, requireOrgContext, partyController.getFinance);
apiRouter.post('/party/finance', requireAuth, requireOrgContext, partyController.createFinance);

// ============================================================================
// 18. INVOICE GENERATOR (CLOUD DOCUMENTS)
// ============================================================================
apiRouter.get('/invoices/documents', requireAuth, requireOrgContext, invoiceDocController.getDocuments);
apiRouter.post('/invoices/documents', requireAuth, requireOrgContext, invoiceDocController.createDocument);
apiRouter.put('/invoices/documents/:id', requireAuth, requireOrgContext, invoiceDocController.updateDocument);
apiRouter.delete('/invoices/documents/:id', requireAuth, requireOrgContext, invoiceDocController.deleteDocument);
