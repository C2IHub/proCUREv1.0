// Compliance Standards Database
// This file contains all pharmaceutical and medtech compliance standards

export interface ComplianceStandard {
  id: string;
  name: string;
  shortName: string;
  type: 'certification' | 'documentation' | 'audit' | 'process' | 'registration';
  category: string[];
  regions: string[];
  regulatoryBodyId: string;
  description: string;
  purpose: string;
  applicableCategories: string[];
  validityPeriod: number; // months
  renewalNotice: number; // days before expiry
  mandatory: boolean;
  weight: number; // for compliance scoring (0-1)
  requirements: string[];
  documentationRequired: string[];
  auditFrequency?: number; // months
  lastUpdated: string;
}

export const complianceStandards: ComplianceStandard[] = [
  // EU/European Standards
  {
    id: 'STD001',
    name: 'EU Good Manufacturing Practice Certification',
    shortName: 'EU GMP',
    type: 'certification',
    category: ['Manufacturing', 'Quality'],
    regions: ['Europe'],
    regulatoryBodyId: 'REG001', // EMA
    description: 'Good Manufacturing Practice certification for pharmaceutical manufacturing and packaging',
    purpose: 'Ensures pharmaceutical products are consistently produced and controlled according to quality standards',
    applicableCategories: ['Primary Packaging', 'Secondary Packaging', 'APIs', 'Raw Materials'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.4,
    requirements: [
      'Quality management system implementation',
      'Personnel training and qualification',
      'Premises and equipment validation',
      'Documentation and record keeping',
      'Production and process controls',
      'Quality control testing'
    ],
    documentationRequired: [
      'Quality Manual',
      'Standard Operating Procedures',
      'Batch records',
      'Validation protocols',
      'Training records'
    ],
    auditFrequency: 24,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD002',
    name: 'ISO 15378 Primary Packaging Materials',
    shortName: 'ISO 15378',
    type: 'certification',
    category: ['Quality', 'Packaging'],
    regions: ['Global'],
    regulatoryBodyId: 'REG002', // ISO
    description: 'Primary packaging materials for medicinal products - Particular requirements for the application of ISO 9001:2015',
    purpose: 'Ensures primary packaging materials meet pharmaceutical quality requirements',
    applicableCategories: ['Primary Packaging'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.35,
    requirements: [
      'ISO 9001:2015 compliance',
      'Risk management for packaging materials',
      'Material safety and compatibility',
      'Contamination control',
      'Traceability systems'
    ],
    documentationRequired: [
      'Certificate of Analysis',
      'Material Safety Data Sheets',
      'Extractables and Leachables studies',
      'Compatibility studies'
    ],
    auditFrequency: 18,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD003',
    name: 'REACH Registration, Evaluation, Authorisation and Restriction of Chemicals',
    shortName: 'REACH',
    type: 'documentation',
    category: ['Chemical Safety', 'Environmental'],
    regions: ['Europe'],
    regulatoryBodyId: 'REG003', // ECHA
    description: 'Registration, Evaluation, Authorisation and Restriction of Chemicals regulation',
    purpose: 'Ensures safe use of chemicals and protects human health and environment',
    applicableCategories: ['Primary Packaging', 'Raw Materials', 'APIs', 'Excipients'],
    validityPeriod: 12,
    renewalNotice: 60,
    mandatory: true,
    weight: 0.2,
    requirements: [
      'Chemical substance registration',
      'Safety data sheet provision',
      'Risk assessment documentation',
      'Safe use instructions',
      'Supply chain communication'
    ],
    documentationRequired: [
      'REACH Registration dossier',
      'Safety Data Sheets',
      'Chemical Safety Report',
      'Downstream user report'
    ],
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD004',
    name: 'USP Chapter 661 Plastic Materials and Components',
    shortName: 'USP <661>',
    type: 'documentation',
    category: ['Material Testing', 'Safety'],
    regions: ['North America', 'Global'],
    regulatoryBodyId: 'REG004', // USP
    description: 'Requirements for plastic materials and components for pharmaceutical use',
    purpose: 'Ensures plastic packaging materials are safe for pharmaceutical contact',
    applicableCategories: ['Primary Packaging'],
    validityPeriod: 24,
    renewalNotice: 60,
    mandatory: true,
    weight: 0.25,
    requirements: [
      'Physicochemical testing',
      'Biological reactivity testing',
      'Extractables testing',
      'Material identification',
      'Compliance certification'
    ],
    documentationRequired: [
      'USP <661> test reports',
      'Certificate of compliance',
      'Material specifications',
      'Test protocols'
    ],
    lastUpdated: '2024-01-01'
  },

  // FDA Standards
  {
    id: 'STD005',
    name: 'FDA Facility Registration',
    shortName: 'FDA Registration',
    type: 'registration',
    category: ['Regulatory', 'Manufacturing'],
    regions: ['North America'],
    regulatoryBodyId: 'REG005', // FDA
    description: 'FDA facility registration for pharmaceutical manufacturing and packaging',
    purpose: 'Ensures FDA oversight of pharmaceutical manufacturing facilities',
    applicableCategories: ['Primary Packaging', 'APIs', 'Raw Materials', 'Equipment'],
    validityPeriod: 24,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.4,
    requirements: [
      'Facility registration with FDA',
      'Process filing',
      'cGMP compliance',
      'FDA inspection readiness',
      'Adverse event reporting'
    ],
    documentationRequired: [
      'FDA registration certificate',
      'Process validation reports',
      'cGMP compliance documentation',
      'Inspection reports'
    ],
    auditFrequency: 24,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD006',
    name: 'FDA Drug Master File',
    shortName: 'FDA DMF',
    type: 'documentation',
    category: ['Regulatory', 'APIs'],
    regions: ['North America'],
    regulatoryBodyId: 'REG005', // FDA
    description: 'FDA Drug Master File for API manufacturing information',
    purpose: 'Provides FDA with confidential detailed information about API manufacturing',
    applicableCategories: ['APIs'],
    validityPeriod: 60,
    renewalNotice: 180,
    mandatory: true,
    weight: 0.45,
    requirements: [
      'Manufacturing process description',
      'Quality control procedures',
      'Stability data',
      'Impurity profiles',
      'Facility information'
    ],
    documentationRequired: [
      'DMF submission',
      'Manufacturing process description',
      'Analytical methods',
      'Stability studies',
      'Impurity qualification'
    ],
    lastUpdated: '2024-01-01'
  },

  // ISO Standards
  {
    id: 'STD007',
    name: 'ISO 9001 Quality Management Systems',
    shortName: 'ISO 9001',
    type: 'certification',
    category: ['Quality', 'Management'],
    regions: ['Global'],
    regulatoryBodyId: 'REG002', // ISO
    description: 'Quality management systems requirements for consistent quality delivery',
    purpose: 'Ensures consistent quality management across all business processes',
    applicableCategories: ['All Categories'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: false,
    weight: 0.25,
    requirements: [
      'Quality management system',
      'Leadership commitment',
      'Risk-based thinking',
      'Process approach',
      'Continuous improvement'
    ],
    documentationRequired: [
      'Quality manual',
      'Process documentation',
      'Internal audit reports',
      'Management review records'
    ],
    auditFrequency: 12,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD008',
    name: 'ISO 13485 Medical Devices Quality Management',
    shortName: 'ISO 13485',
    type: 'certification',
    category: ['Quality', 'Medical Devices'],
    regions: ['Global'],
    regulatoryBodyId: 'REG002', // ISO
    description: 'Quality management systems for medical devices',
    purpose: 'Ensures quality management systems meet medical device regulatory requirements',
    applicableCategories: ['Equipment', 'Medical Devices'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.4,
    requirements: [
      'Medical device quality system',
      'Risk management',
      'Design controls',
      'Corrective and preventive actions',
      'Post-market surveillance'
    ],
    documentationRequired: [
      'Quality manual',
      'Design history file',
      'Risk management file',
      'Clinical evaluation',
      'Post-market surveillance reports'
    ],
    auditFrequency: 18,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD009',
    name: 'ISO 17025 Testing and Calibration Laboratories',
    shortName: 'ISO 17025',
    type: 'certification',
    category: ['Testing', 'Quality'],
    regions: ['Global'],
    regulatoryBodyId: 'REG002', // ISO
    description: 'General requirements for the competence of testing and calibration laboratories',
    purpose: 'Ensures laboratory testing competence and reliability of results',
    applicableCategories: ['Testing Services'],
    validityPeriod: 48,
    renewalNotice: 120,
    mandatory: true,
    weight: 0.5,
    requirements: [
      'Management system requirements',
      'Technical requirements',
      'Competence of personnel',
      'Equipment and facilities',
      'Measurement traceability'
    ],
    documentationRequired: [
      'Accreditation certificate',
      'Scope of accreditation',
      'Quality manual',
      'Technical procedures',
      'Calibration certificates'
    ],
    auditFrequency: 24,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD010',
    name: 'ISO 14001 Environmental Management Systems',
    shortName: 'ISO 14001',
    type: 'certification',
    category: ['Environmental', 'Sustainability'],
    regions: ['Global'],
    regulatoryBodyId: 'REG002', // ISO
    description: 'Environmental management systems requirements',
    purpose: 'Ensures environmental responsibility and sustainability practices',
    applicableCategories: ['All Categories'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: false,
    weight: 0.15,
    requirements: [
      'Environmental policy',
      'Environmental aspects identification',
      'Legal compliance',
      'Environmental objectives',
      'Monitoring and measurement'
    ],
    documentationRequired: [
      'Environmental policy',
      'Environmental aspects register',
      'Legal register',
      'Environmental objectives',
      'Monitoring reports'
    ],
    auditFrequency: 12,
    lastUpdated: '2024-01-01'
  },

  // Packaging and Distribution Standards
  {
    id: 'STD011',
    name: 'EU Packaging and Packaging Waste Directive',
    shortName: 'EU Packaging Directive',
    type: 'documentation',
    category: ['Packaging', 'Environmental'],
    regions: ['Europe'],
    regulatoryBodyId: 'REG006', // EU Commission
    description: 'Directive 94/62/EC on packaging and packaging waste',
    purpose: 'Ensures packaging waste prevention and promotes recycling',
    applicableCategories: ['Secondary Packaging'],
    validityPeriod: 12,
    renewalNotice: 60,
    mandatory: true,
    weight: 0.3,
    requirements: [
      'Packaging waste reduction',
      'Recyclability requirements',
      'Heavy metals restrictions',
      'Marking requirements',
      'Recovery targets'
    ],
    documentationRequired: [
      'Packaging compliance declaration',
      'Material composition data',
      'Recyclability assessment',
      'Heavy metals testing'
    ],
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD012',
    name: 'Good Distribution Practice',
    shortName: 'GDP',
    type: 'certification',
    category: ['Distribution', 'Quality'],
    regions: ['Europe', 'Global'],
    regulatoryBodyId: 'REG007', // National Medicines Agencies
    description: 'Good Distribution Practice for pharmaceutical products',
    purpose: 'Ensures quality and integrity of medicines during distribution',
    applicableCategories: ['Logistics'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.45,
    requirements: [
      'Quality management system',
      'Personnel qualification',
      'Premises and equipment',
      'Documentation system',
      'Operations procedures'
    ],
    documentationRequired: [
      'GDP certificate',
      'Quality manual',
      'Temperature mapping studies',
      'Transportation validation',
      'Complaint handling procedures'
    ],
    auditFrequency: 24,
    lastUpdated: '2024-01-01'
  },

  // Laboratory and Testing Standards
  {
    id: 'STD013',
    name: 'Good Laboratory Practice',
    shortName: 'GLP',
    type: 'certification',
    category: ['Testing', 'Quality'],
    regions: ['Global'],
    regulatoryBodyId: 'REG008', // National GLP Authorities
    description: 'Good Laboratory Practice for non-clinical safety studies',
    purpose: 'Ensures quality and integrity of non-clinical safety data',
    applicableCategories: ['Testing Services'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.4,
    requirements: [
      'Test facility organization',
      'Quality assurance programme',
      'Personnel qualifications',
      'Facilities requirements',
      'Equipment maintenance'
    ],
    documentationRequired: [
      'GLP certificate',
      'Quality assurance procedures',
      'Study protocols',
      'Raw data documentation',
      'Final study reports'
    ],
    auditFrequency: 24,
    lastUpdated: '2024-01-01'
  },

  // Chemical and Environmental Standards
  {
    id: 'STD014',
    name: 'Toxic Substances Control Act',
    shortName: 'TSCA',
    type: 'documentation',
    category: ['Chemical Safety', 'Environmental'],
    regions: ['North America'],
    regulatoryBodyId: 'REG009', // EPA
    description: 'US Toxic Substances Control Act compliance',
    purpose: 'Regulates chemical substances and mixtures in commerce',
    applicableCategories: ['Raw Materials', 'APIs'],
    validityPeriod: 12,
    renewalNotice: 60,
    mandatory: true,
    weight: 0.25,
    requirements: [
      'Chemical inventory reporting',
      'New chemical notifications',
      'Risk evaluations',
      'Restrictions compliance',
      'Recordkeeping requirements'
    ],
    documentationRequired: [
      'TSCA inventory listing',
      'Chemical data reporting',
      'Safety data sheets',
      'Risk assessment data'
    ],
    lastUpdated: '2024-01-01'
  },

  // Medical Device Standards
  {
    id: 'STD015',
    name: 'CE Marking for Medical Devices',
    shortName: 'CE Marking',
    type: 'certification',
    category: ['Medical Devices', 'Regulatory'],
    regions: ['Europe'],
    regulatoryBodyId: 'REG010', // EU Notified Bodies
    description: 'CE marking conformity assessment for medical devices',
    purpose: 'Demonstrates conformity with EU medical device regulations',
    applicableCategories: ['Equipment', 'Medical Devices'],
    validityPeriod: 60,
    renewalNotice: 120,
    mandatory: true,
    weight: 0.5,
    requirements: [
      'Conformity assessment',
      'Technical documentation',
      'Clinical evaluation',
      'Post-market surveillance',
      'Declaration of conformity'
    ],
    documentationRequired: [
      'CE certificate',
      'Technical documentation',
      'Clinical evaluation report',
      'Declaration of conformity',
      'Instructions for use'
    ],
    auditFrequency: 36,
    lastUpdated: '2024-01-01'
  },

  // Additional Specialized Standards
  {
    id: 'STD016',
    name: 'Forest Stewardship Council Certification',
    shortName: 'FSC',
    type: 'certification',
    category: ['Sustainability', 'Packaging'],
    regions: ['Global'],
    regulatoryBodyId: 'REG011', // FSC
    description: 'Forest Stewardship Council certification for sustainable packaging',
    purpose: 'Ensures responsible forest management and sustainable packaging',
    applicableCategories: ['Secondary Packaging'],
    validityPeriod: 60,
    renewalNotice: 90,
    mandatory: false,
    weight: 0.1,
    requirements: [
      'Chain of custody certification',
      'Sustainable sourcing',
      'Forest management standards',
      'Traceability systems',
      'Annual surveillance'
    ],
    documentationRequired: [
      'FSC certificate',
      'Chain of custody documentation',
      'Supplier declarations',
      'Product labeling compliance'
    ],
    auditFrequency: 12,
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD017',
    name: 'Certificate of Suitability to European Pharmacopoeia',
    shortName: 'CEP',
    type: 'certification',
    category: ['APIs', 'Quality'],
    regions: ['Europe'],
    regulatoryBodyId: 'REG012', // EDQM
    description: 'Certificate of Suitability to the European Pharmacopoeia for APIs',
    purpose: 'Demonstrates API compliance with European Pharmacopoeia standards',
    applicableCategories: ['APIs'],
    validityPeriod: 60,
    renewalNotice: 180,
    mandatory: true,
    weight: 0.4,
    requirements: [
      'Pharmacopoeia compliance',
      'Manufacturing process validation',
      'Quality control testing',
      'Impurity profiling',
      'Stability studies'
    ],
    documentationRequired: [
      'CEP certificate',
      'Manufacturing process description',
      'Analytical methods validation',
      'Stability data',
      'Impurity qualification studies'
    ],
    lastUpdated: '2024-01-01'
  },
  {
    id: 'STD018',
    name: 'Health Canada Medical Device License',
    shortName: 'Health Canada MDL',
    type: 'certification',
    category: ['Medical Devices', 'Regulatory'],
    regions: ['North America'],
    regulatoryBodyId: 'REG013', // Health Canada
    description: 'Health Canada medical device license',
    purpose: 'Authorizes medical device manufacturing and distribution in Canada',
    applicableCategories: ['Equipment', 'Medical Devices'],
    validityPeriod: 36,
    renewalNotice: 90,
    mandatory: true,
    weight: 0.4,
    requirements: [
      'Quality system certification',
      'Device licensing',
      'Establishment licensing',
      'Canadian medical device regulations compliance',
      'Post-market surveillance'
    ],
    documentationRequired: [
      'Medical device license',
      'Establishment license',
      'Quality system certificate',
      'Device master file',
      'Clinical data'
    ],
    auditFrequency: 24,
    lastUpdated: '2024-01-01'
  }
];

// Helper functions for standards management
export function getStandardById(id: string): ComplianceStandard | undefined {
  return complianceStandards.find(standard => standard.id === id);
}

export function getStandardsByCategory(category: string): ComplianceStandard[] {
  return complianceStandards.filter(standard => 
    standard.applicableCategories.includes(category) || 
    standard.applicableCategories.includes('All Categories')
  );
}

export function getStandardsByRegion(region: string): ComplianceStandard[] {
  return complianceStandards.filter(standard => 
    standard.regions.includes(region) || 
    standard.regions.includes('Global')
  );
}

export function getMandatoryStandards(): ComplianceStandard[] {
  return complianceStandards.filter(standard => standard.mandatory);
}

export function getStandardsByType(type: string): ComplianceStandard[] {
  return complianceStandards.filter(standard => standard.type === type);
}

export function getExpiringStandards(daysAhead: number = 90): ComplianceStandard[] {
  // This would be used with actual compliance data to find expiring certifications
  return complianceStandards.filter(standard => standard.renewalNotice <= daysAhead);
}

export function getStandardsStatistics() {
  const total = complianceStandards.length;
  const mandatory = getMandatoryStandards().length;
  const byType = {
    certification: getStandardsByType('certification').length,
    documentation: getStandardsByType('documentation').length,
    registration: getStandardsByType('registration').length,
    audit: getStandardsByType('audit').length,
    process: getStandardsByType('process').length
  };
  const byRegion = {
    global: getStandardsByRegion('Global').length,
    europe: getStandardsByRegion('Europe').length,
    northAmerica: getStandardsByRegion('North America').length,
    asiaPacific: getStandardsByRegion('Asia Pacific').length
  };
  
  return {
    total,
    mandatory,
    optional: total - mandatory,
    byType,
    byRegion
  };
}