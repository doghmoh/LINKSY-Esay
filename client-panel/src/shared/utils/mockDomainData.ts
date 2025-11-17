import { DomainEntry } from '../components/domains/DomainTable';

// Shared mock data for domains across the application
export const mockDomainData: DomainEntry[] = [
  { id: 101, domainName: 'linksy.dz', nextBillingDate: '2024-12-15', status: 'active', isProtected: true, isLocked: true },
  { id: 102, domainName: 'mycoolsite.com', nextBillingDate: '2025-03-01', status: 'suspended', isProtected: false, isLocked: true },
  { id: 103, domainName: 'oldproject.net', nextBillingDate: '2023-11-20', status: 'expired', isProtected: true, isLocked: false },
  { id: 104, domainName: 'business-dz.com', nextBillingDate: '2024-08-30', status: 'active', isProtected: true, isLocked: true },
  { id: 105, domainName: 'parked-domain.org', nextBillingDate: 'N/A', status: 'closed', isProtected: false, isLocked: false },
  { id: 106, domainName: 'another-active.dz', nextBillingDate: '2025-01-10', status: 'active', isProtected: false, isLocked: false },
  { id: 107, domainName: 'needs-renewal.com', nextBillingDate: '2024-07-15', status: 'expired', isProtected: false, isLocked: true },
  { id: 108, domainName: 'temp-project.dz', nextBillingDate: '2024-09-01', status: 'suspended', isProtected: true, isLocked: false },
];

// Helper function to get domain by ID
export const getDomainById = (id: number): DomainEntry | undefined => {
  return mockDomainData.find(domain => domain.id === id);
};
