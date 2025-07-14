import { ComplianceRequirement } from '../types';

// Compliance Requirements Mapping
// This file maps suppliers to their applicable compliance standards

import { ComplianceRequirement } from '../types';
import { complianceStandards, getStandardsByCategory, getStandardsByRegion } from './complianceStandards';
import { masterSuppliers } from './masterSuppliers';

// Supplier-specific compliance requirements with current status
export interface SupplierComplianceStatus {
  supplierId: string;
  standardId: string;
  currentStatus: 'valid' | 'expiring' | 'expired' | 'pending' | 'not_applicable';
  expiryDate?: string;
  lastVerified?: string;
  documentUrl?: string;
  notes?: string;
}

// Current compliance status for all suppliers
export const supplierComplianceStatus: SupplierComplianceStatus[] = [
  // MedTech Solutions GmbH (SUP001) - Primary Packaging, Europe
  { supplierId: 'SUP001', standardId: 'STD001', currentStatus: 'valid', expiryDate: '2025-06-15', lastVerified: '2024-01-15' },
  { supplierId: 'SUP001', standardId: 'STD002', currentStatus: 'valid', expiryDate: '2025-09-30', lastVerified: '2024-01-10' },
  { supplierId: 'SUP001', standardId: 'STD003', currentStatus: 'valid', expiryDate: '2024-12-31', lastVerified: '2024-01-05' },
  { supplierId: 'SUP001', standardId: 'STD004', currentStatus: 'valid', expiryDate: '2025-01-15', lastVerified: '2024-01-01' },
  { supplierId: 'SUP001', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-03-15', lastVerified: '2024-01-01' },

  // GlobalPack Ltd (SUP002) - Primary Packaging, Europe
  { supplierId: 'SUP002', standardId: 'STD001', currentStatus: 'expiring', expiryDate: '2024-03-15', lastVerified: '2023-12-01' },
  { supplierId: 'SUP002', standardId: 'STD002', currentStatus: 'valid', expiryDate: '2025-08-20', lastVerified: '2024-01-05' },
  { supplierId: 'SUP002', standardId: 'STD003', currentStatus: 'valid', expiryDate: '2024-11-30', lastVerified: '2024-01-01' },
  { supplierId: 'SUP002', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-01-20', lastVerified: '2024-01-01' },

  // PharmaVial Inc (SUP003) - Primary Packaging, North America
  { supplierId: 'SUP003', standardId: 'STD005', currentStatus: 'valid', expiryDate: '2025-09-10', lastVerified: '2024-01-10' },
  { supplierId: 'SUP003', standardId: 'STD002', currentStatus: 'valid', expiryDate: '2025-12-01', lastVerified: '2024-01-08' },
  { supplierId: 'SUP003', standardId: 'STD018', currentStatus: 'valid', expiryDate: '2026-06-15', lastVerified: '2024-01-05' },
  { supplierId: 'SUP003', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-09-10', lastVerified: '2024-01-01' },

  // ABC Pharma Supply (SUP008) - Raw Materials, North America
  { supplierId: 'SUP008', standardId: 'STD005', currentStatus: 'expiring', expiryDate: '2024-02-15', lastVerified: '2023-12-15' },
  { supplierId: 'SUP008', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-06-10', lastVerified: '2024-01-01' },
  { supplierId: 'SUP008', standardId: 'STD014', currentStatus: 'pending', expiryDate: '2024-06-10', lastVerified: '2023-12-01' },

  // BioActive Compounds Ltd (SUP010) - APIs, Europe
  { supplierId: 'SUP010', standardId: 'STD001', currentStatus: 'valid', expiryDate: '2025-01-15', lastVerified: '2024-01-01' },
  { supplierId: 'SUP010', standardId: 'STD017', currentStatus: 'valid', expiryDate: '2026-01-15', lastVerified: '2024-01-01' },
  { supplierId: 'SUP010', standardId: 'STD003', currentStatus: 'valid', expiryDate: '2028-01-15', lastVerified: '2024-01-01' },
  { supplierId: 'SUP010', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-01-15', lastVerified: '2024-01-01' },

  // European Containers Co (SUP005) - Secondary Packaging, Europe
  { supplierId: 'SUP005', standardId: 'STD011', currentStatus: 'valid', expiryDate: '2024-12-31', lastVerified: '2024-01-01' },
  { supplierId: 'SUP005', standardId: 'STD016', currentStatus: 'valid', expiryDate: '2026-11-25', lastVerified: '2024-01-01' },
  { supplierId: 'SUP005', standardId: 'STD010', currentStatus: 'valid', expiryDate: '2025-11-25', lastVerified: '2024-01-01' },
  { supplierId: 'SUP005', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-11-25', lastVerified: '2024-01-01' },

  // MedDevice Technologies (SUP013) - Equipment, Europe
  { supplierId: 'SUP013', standardId: 'STD015', currentStatus: 'valid', expiryDate: '2026-05-30', lastVerified: '2024-01-01' },
  { supplierId: 'SUP013', standardId: 'STD008', currentStatus: 'valid', expiryDate: '2025-05-30', lastVerified: '2024-01-01' },
  { supplierId: 'SUP013', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-05-30', lastVerified: '2024-01-01' },

  // QualityLabs International (SUP018) - Testing Services, Europe
  { supplierId: 'SUP018', standardId: 'STD009', currentStatus: 'valid', expiryDate: '2026-02-28', lastVerified: '2024-01-01' },
  { supplierId: 'SUP018', standardId: 'STD013', currentStatus: 'valid', expiryDate: '2025-02-28', lastVerified: '2024-01-01' },
  { supplierId: 'SUP018', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-02-28', lastVerified: '2024-01-01' },

  // ColdChain Logistics (SUP020) - Logistics, Europe
  { supplierId: 'SUP020', standardId: 'STD012', currentStatus: 'valid', expiryDate: '2025-06-15', lastVerified: '2024-01-01' },
  { supplierId: 'SUP020', standardId: 'STD007', currentStatus: 'valid', expiryDate: '2025-06-15', lastVerified: '2024-01-01' },
];

// Generate compliance requirements for all suppliers
export function generateComplianceRequirements(): ComplianceRequirement[] {
  const allRequirements: ComplianceRequirement[] = [];
  
  masterSuppliers.forEach(supplier => {
    // Get applicable standards based on category and region
    const categoryStandards = getStandardsByCategory(supplier.category);
    const regionStandards = getStandardsByRegion(supplier.region);
    
    // Combine and deduplicate standards
    const applicableStandards = [...new Set([...categoryStandards, ...regionStandards])];
    
    // Get current status for each standard
    const requirements = applicableStandards.map(standard => {
      const status = supplierComplianceStatus.find(
        s => s.supplierId === supplier.id && s.standardId === standard.id
      );
      
      return {
        id: `${supplier.id}-${standard.id}`,
        name: standard.name,
        type: standard.type,
        mandatory: standard.mandatory,
        description: standard.description,
        validityPeriod: standard.validityPeriod,
        renewalNotice: standard.renewalNotice,
        regulatoryBody: standard.regulatoryBodyId,
        currentStatus: status?.currentStatus || 'not_applicable',
        expiryDate: status?.expiryDate,
        lastVerified: status?.lastVerified,
        documentUrl: status?.documentUrl
      };
    });
    
    allRequirements.push({
      id: `req-${supplier.id}`,
      supplierId: supplier.id,
      category: supplier.category,
      region: supplier.region,
      requirements,
      lastUpdated: new Date().toISOString()
    });
  });
  
  return allRequirements;
}

// Get all compliance requirements (generated dynamically)
export const complianceRequirementsMapping = generateComplianceRequirements();

// Helper functions for compliance requirements management
export function getComplianceRequirementsBySupplier(supplierId: string): ComplianceRequirement | undefined {
  return complianceRequirementsMapping.find(req => req.supplierId === supplierId);
}

export function getComplianceRequirementsByCategory(category: string): ComplianceRequirement[] {
  return complianceRequirementsMapping.filter(req => req.category === category);
}

export function getComplianceRequirementsByRegion(region: string): ComplianceRequirement[] {
  return complianceRequirementsMapping.filter(req => req.region === region);
}

export function getExpiringRequirements(daysAhead: number = 90): any[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
  
  const expiringReqs: any[] = [];
  
  complianceRequirementsMapping.forEach(compReq => {
    compReq.requirements.forEach(req => {
      if (req.expiryDate) {
        const expiryDate = new Date(req.expiryDate);
        if (expiryDate <= cutoffDate) {
          expiringReqs.push({
            supplierId: compReq.supplierId,
            requirementId: req.id,
            requirementName: req.name,
            expiryDate: req.expiryDate,
            daysUntilExpiry: Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            mandatory: req.mandatory,
            regulatoryBody: req.regulatoryBody
          });
        }
      }
    });
  });
  
  return expiringReqs.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

export function getComplianceStatistics() {
  const totalRequirements = complianceRequirementsMapping.reduce((sum, req) => sum + req.requirements.length, 0);
  let validCount = 0;
  let expiringCount = 0;
  let expiredCount = 0;
  let pendingCount = 0;
  
  complianceRequirementsMapping.forEach(compReq => {
    compReq.requirements.forEach(req => {
      switch (req.currentStatus) {
        case 'valid': validCount++; break;
        case 'expiring': expiringCount++; break;
        case 'expired': expiredCount++; break;
        case 'pending': pendingCount++; break;
      }
    });
  });
  
  return {
    total: totalRequirements,
    valid: validCount,
    expiring: expiringCount,
    expired: expiredCount,
    pending: pendingCount,
    complianceRate: Math.round((validCount / totalRequirements) * 100)
  };
}