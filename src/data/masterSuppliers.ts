// Master Supplier Database for Pharmaceutical and MedTech Industries
// This file contains the comprehensive supplier master data

import { SupplierMaster } from '../types';

export const masterSuppliers: SupplierMaster[] = [
  // Primary Packaging Suppliers
  {
    id: 'SUP001',
    name: 'MedTech Solutions GmbH',
    category: 'Primary Packaging',
    region: 'Europe',
    establishedYear: 2010,
    employeeCount: 250,
    annualRevenue: '$50M',
    facilities: ['Germany', 'Netherlands'],
    primaryContact: {
      name: 'Hans Mueller',
      email: 'h.mueller@medtech-solutions.eu',
      phone: '+49-123-456-7890'
    },
    onboardingDate: '2019-03-15',
    status: 'active'
  },
  {
    id: 'SUP002',
    name: 'GlobalPack Ltd',
    category: 'Primary Packaging',
    region: 'Europe',
    establishedYear: 2005,
    employeeCount: 180,
    annualRevenue: '$35M',
    facilities: ['UK', 'Ireland'],
    primaryContact: {
      name: 'Sarah Johnson',
      email: 's.johnson@globalpack.co.uk',
      phone: '+44-20-1234-5678'
    },
    onboardingDate: '2020-01-20',
    status: 'active'
  },
  {
    id: 'SUP003',
    name: 'PharmaVial Inc',
    category: 'Primary Packaging',
    region: 'North America',
    establishedYear: 2008,
    employeeCount: 320,
    annualRevenue: '$75M',
    facilities: ['USA', 'Canada'],
    primaryContact: {
      name: 'Jennifer Davis',
      email: 'j.davis@pharmavial.com',
      phone: '+1-555-234-5678'
    },
    onboardingDate: '2018-09-10',
    status: 'active'
  },
  {
    id: 'SUP004',
    name: 'AsiaPackaging Co Ltd',
    category: 'Primary Packaging',
    region: 'Asia Pacific',
    establishedYear: 2012,
    employeeCount: 450,
    annualRevenue: '$60M',
    facilities: ['Singapore', 'Malaysia', 'Thailand'],
    primaryContact: {
      name: 'Li Wei Chen',
      email: 'l.chen@asiapackaging.com',
      phone: '+65-6789-0123'
    },
    onboardingDate: '2021-02-28',
    status: 'active'
  },

  // Secondary Packaging Suppliers
  {
    id: 'SUP005',
    name: 'European Containers Co',
    category: 'Secondary Packaging',
    region: 'Europe',
    establishedYear: 2008,
    employeeCount: 300,
    annualRevenue: '$75M',
    facilities: ['France', 'Spain', 'Italy'],
    primaryContact: {
      name: 'Marie Dubois',
      email: 'm.dubois@eurocontainers.fr',
      phone: '+33-1-23-45-67-89'
    },
    onboardingDate: '2018-11-25',
    status: 'active'
  },
  {
    id: 'SUP006',
    name: 'SecurePack Industries',
    category: 'Secondary Packaging',
    region: 'North America',
    establishedYear: 2015,
    employeeCount: 220,
    annualRevenue: '$45M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Robert Martinez',
      email: 'r.martinez@securepack.com',
      phone: '+1-555-345-6789'
    },
    onboardingDate: '2020-06-15',
    status: 'active'
  },
  {
    id: 'SUP007',
    name: 'CardboardTech Solutions',
    category: 'Secondary Packaging',
    region: 'Europe',
    establishedYear: 2011,
    employeeCount: 180,
    annualRevenue: '$32M',
    facilities: ['Germany', 'Poland'],
    primaryContact: {
      name: 'Klaus Weber',
      email: 'k.weber@cardboardtech.de',
      phone: '+49-234-567-8901'
    },
    onboardingDate: '2019-08-20',
    status: 'active'
  },

  // Raw Materials & APIs
  {
    id: 'SUP008',
    name: 'ABC Pharma Supply',
    category: 'Raw Materials',
    region: 'North America',
    establishedYear: 2015,
    employeeCount: 120,
    annualRevenue: '$25M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Michael Chen',
      email: 'm.chen@abcpharma.com',
      phone: '+1-555-123-4567'
    },
    onboardingDate: '2021-06-10',
    status: 'active'
  },
  {
    id: 'SUP009',
    name: 'ChemSource International',
    category: 'Raw Materials',
    region: 'Europe',
    establishedYear: 2003,
    employeeCount: 280,
    annualRevenue: '$85M',
    facilities: ['Switzerland', 'Belgium'],
    primaryContact: {
      name: 'Dr. Anna Schneider',
      email: 'a.schneider@chemsource.ch',
      phone: '+41-22-345-6789'
    },
    onboardingDate: '2017-04-12',
    status: 'active'
  },
  {
    id: 'SUP010',
    name: 'BioActive Compounds Ltd',
    category: 'APIs',
    region: 'Europe',
    establishedYear: 2009,
    employeeCount: 150,
    annualRevenue: '$40M',
    facilities: ['Ireland', 'UK'],
    primaryContact: {
      name: 'Dr. James O\'Connor',
      email: 'j.oconnor@bioactive.ie',
      phone: '+353-1-234-5678'
    },
    onboardingDate: '2019-01-15',
    status: 'active'
  },
  {
    id: 'SUP011',
    name: 'PharmaIngredients Corp',
    category: 'APIs',
    region: 'North America',
    establishedYear: 2012,
    employeeCount: 200,
    annualRevenue: '$55M',
    facilities: ['USA', 'Puerto Rico'],
    primaryContact: {
      name: 'Dr. Patricia Williams',
      email: 'p.williams@pharmaingredients.com',
      phone: '+1-555-456-7890'
    },
    onboardingDate: '2020-03-08',
    status: 'active'
  },
  {
    id: 'SUP012',
    name: 'IndiaAPI Manufacturing',
    category: 'APIs',
    region: 'Asia Pacific',
    establishedYear: 2007,
    employeeCount: 380,
    annualRevenue: '$65M',
    facilities: ['India'],
    primaryContact: {
      name: 'Rajesh Patel',
      email: 'r.patel@indiaapi.in',
      phone: '+91-22-3456-7890'
    },
    onboardingDate: '2018-07-22',
    status: 'active'
  },

  // Equipment & Technology
  {
    id: 'SUP013',
    name: 'MedDevice Technologies',
    category: 'Equipment',
    region: 'Europe',
    establishedYear: 2006,
    employeeCount: 160,
    annualRevenue: '$42M',
    facilities: ['Germany', 'Austria'],
    primaryContact: {
      name: 'Dr. Stefan Hoffmann',
      email: 's.hoffmann@meddevice.de',
      phone: '+49-345-678-9012'
    },
    onboardingDate: '2019-05-30',
    status: 'active'
  },
  {
    id: 'SUP014',
    name: 'PrecisionTech Systems',
    category: 'Equipment',
    region: 'North America',
    establishedYear: 2010,
    employeeCount: 140,
    annualRevenue: '$38M',
    facilities: ['USA'],
    primaryContact: {
      name: 'David Thompson',
      email: 'd.thompson@precisiontech.com',
      phone: '+1-555-567-8901'
    },
    onboardingDate: '2020-09-14',
    status: 'active'
  },
  {
    id: 'SUP015',
    name: 'AutomationPlus Ltd',
    category: 'Equipment',
    region: 'Europe',
    establishedYear: 2013,
    employeeCount: 95,
    annualRevenue: '$28M',
    facilities: ['UK'],
    primaryContact: {
      name: 'Emma Richardson',
      email: 'e.richardson@automationplus.co.uk',
      phone: '+44-20-2345-6789'
    },
    onboardingDate: '2021-01-18',
    status: 'active'
  },

  // Excipients & Additives
  {
    id: 'SUP016',
    name: 'ExcipientSource Europe',
    category: 'Excipients',
    region: 'Europe',
    establishedYear: 2004,
    employeeCount: 110,
    annualRevenue: '$30M',
    facilities: ['Netherlands', 'Belgium'],
    primaryContact: {
      name: 'Dr. Pieter van der Berg',
      email: 'p.vandeberg@excipient.nl',
      phone: '+31-20-345-6789'
    },
    onboardingDate: '2018-12-05',
    status: 'active'
  },
  {
    id: 'SUP017',
    name: 'SpecialtyChemicals Inc',
    category: 'Excipients',
    region: 'North America',
    establishedYear: 2011,
    employeeCount: 85,
    annualRevenue: '$22M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Dr. Lisa Anderson',
      email: 'l.anderson@specialtychem.com',
      phone: '+1-555-678-9012'
    },
    onboardingDate: '2020-11-12',
    status: 'active'
  },

  // Quality Control & Testing
  {
    id: 'SUP018',
    name: 'QualityLabs International',
    category: 'Testing Services',
    region: 'Europe',
    establishedYear: 2008,
    employeeCount: 200,
    annualRevenue: '$48M',
    facilities: ['Germany', 'France', 'UK'],
    primaryContact: {
      name: 'Dr. Catherine Müller',
      email: 'c.muller@qualitylabs.eu',
      phone: '+49-456-789-0123'
    },
    onboardingDate: '2019-02-28',
    status: 'active'
  },
  {
    id: 'SUP019',
    name: 'AnalyticsPro Services',
    category: 'Testing Services',
    region: 'North America',
    establishedYear: 2014,
    employeeCount: 130,
    annualRevenue: '$35M',
    facilities: ['USA', 'Canada'],
    primaryContact: {
      name: 'Dr. Mark Johnson',
      email: 'm.johnson@analyticspro.com',
      phone: '+1-555-789-0123'
    },
    onboardingDate: '2021-04-20',
    status: 'active'
  },

  // Logistics & Distribution
  {
    id: 'SUP020',
    name: 'ColdChain Logistics',
    category: 'Logistics',
    region: 'Europe',
    establishedYear: 2009,
    employeeCount: 350,
    annualRevenue: '$90M',
    facilities: ['Germany', 'Netherlands', 'France', 'UK'],
    primaryContact: {
      name: 'Thomas Schneider',
      email: 't.schneider@coldchain.eu',
      phone: '+49-567-890-1234'
    },
    onboardingDate: '2018-06-15',
    status: 'active'
  },
  {
    id: 'SUP021',
    name: 'PharmaTransport USA',
    category: 'Logistics',
    region: 'North America',
    establishedYear: 2012,
    employeeCount: 280,
    annualRevenue: '$70M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Amanda Rodriguez',
      email: 'a.rodriguez@pharmatransport.com',
      phone: '+1-555-890-1234'
    },
    onboardingDate: '2020-08-10',
    status: 'active'
  },

  // Specialized Suppliers
  {
    id: 'SUP022',
    name: 'BioSafety Solutions',
    category: 'Safety Equipment',
    region: 'Europe',
    establishedYear: 2007,
    employeeCount: 75,
    annualRevenue: '$18M',
    facilities: ['Sweden', 'Denmark'],
    primaryContact: {
      name: 'Dr. Erik Larsson',
      email: 'e.larsson@biosafety.se',
      phone: '+46-8-234-5678'
    },
    onboardingDate: '2019-10-05',
    status: 'active'
  },
  {
    id: 'SUP023',
    name: 'CleanRoom Technologies',
    category: 'Facility Equipment',
    region: 'North America',
    employeeCount: 120,
    annualRevenue: '$32M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Dr. Rachel Green',
      email: 'r.green@cleanroom.com',
      phone: '+1-555-901-2345'
    },
    onboardingDate: '2020-12-18',
    status: 'active'
  },
  {
    id: 'SUP024',
    name: 'SterileTech Europe',
    category: 'Sterilization Services',
    region: 'Europe',
    establishedYear: 2010,
    employeeCount: 90,
    annualRevenue: '$25M',
    facilities: ['Belgium', 'Netherlands'],
    primaryContact: {
      name: 'Dr. Marc Janssen',
      email: 'm.janssen@steriletech.be',
      phone: '+32-2-345-6789'
    },
    onboardingDate: '2021-03-22',
    status: 'active'
  },

  // Additional Primary Packaging
  {
    id: 'SUP025',
    name: 'FlexiPack Solutions',
    category: 'Primary Packaging',
    region: 'Asia Pacific',
    establishedYear: 2014,
    employeeCount: 200,
    annualRevenue: '$45M',
    facilities: ['Japan', 'South Korea'],
    primaryContact: {
      name: 'Hiroshi Tanaka',
      email: 'h.tanaka@flexipack.jp',
      phone: '+81-3-4567-8901'
    },
    onboardingDate: '2021-07-15',
    status: 'active'
  },
  {
    id: 'SUP026',
    name: 'GlassTech Pharmaceuticals',
    category: 'Primary Packaging',
    region: 'Europe',
    establishedYear: 2005,
    employeeCount: 160,
    annualRevenue: '$38M',
    facilities: ['Czech Republic', 'Slovakia'],
    primaryContact: {
      name: 'Pavel Novák',
      email: 'p.novak@glasstech.cz',
      phone: '+420-234-567-890'
    },
    onboardingDate: '2018-04-30',
    status: 'active'
  },

  // Additional Raw Materials
  {
    id: 'SUP027',
    name: 'PureChem Industries',
    category: 'Raw Materials',
    region: 'Asia Pacific',
    establishedYear: 2006,
    employeeCount: 320,
    annualRevenue: '$78M',
    facilities: ['China', 'India'],
    primaryContact: {
      name: 'Dr. Zhang Wei',
      email: 'z.wei@purechem.cn',
      phone: '+86-21-3456-7890'
    },
    onboardingDate: '2019-09-12',
    status: 'active'
  },
  {
    id: 'SUP028',
    name: 'NaturalSource Extracts',
    category: 'Raw Materials',
    region: 'South America',
    establishedYear: 2011,
    employeeCount: 95,
    annualRevenue: '$28M',
    facilities: ['Brazil', 'Colombia'],
    primaryContact: {
      name: 'Dr. Carlos Silva',
      email: 'c.silva@naturalsource.br',
      phone: '+55-11-2345-6789'
    },
    onboardingDate: '2020-05-25',
    status: 'active'
  },

  // Additional Equipment
  {
    id: 'SUP029',
    name: 'ProcessControl Systems',
    category: 'Equipment',
    region: 'North America',
    employeeCount: 110,
    annualRevenue: '$35M',
    facilities: ['Canada'],
    primaryContact: {
      name: 'Dr. John MacDonald',
      email: 'j.macdonald@processcontrol.ca',
      phone: '+1-416-234-5678'
    },
    onboardingDate: '2019-11-08',
    status: 'active'
  },
  {
    id: 'SUP030',
    name: 'MicroTech Instruments',
    category: 'Equipment',
    region: 'Europe',
    establishedYear: 2013,
    employeeCount: 85,
    annualRevenue: '$24M',
    facilities: ['Finland', 'Estonia'],
    primaryContact: {
      name: 'Dr. Mika Virtanen',
      email: 'm.virtanen@microtech.fi',
      phone: '+358-9-345-6789'
    },
    onboardingDate: '2021-08-30',
    status: 'active'
  },

  // Additional Specialized Services
  {
    id: 'SUP031',
    name: 'RegulatoryConsult Pro',
    category: 'Consulting Services',
    region: 'Europe',
    establishedYear: 2008,
    employeeCount: 45,
    annualRevenue: '$15M',
    facilities: ['Switzerland'],
    primaryContact: {
      name: 'Dr. Ursula Zimmermann',
      email: 'u.zimmermann@regconsult.ch',
      phone: '+41-44-234-5678'
    },
    onboardingDate: '2020-02-14',
    status: 'active'
  },
  {
    id: 'SUP032',
    name: 'ValidationServices Inc',
    category: 'Validation Services',
    region: 'North America',
    establishedYear: 2012,
    employeeCount: 65,
    annualRevenue: '$20M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Dr. Susan Taylor',
      email: 's.taylor@validation.com',
      phone: '+1-555-012-3456'
    },
    onboardingDate: '2021-05-12',
    status: 'active'
  },

  // Additional APIs
  {
    id: 'SUP033',
    name: 'BiotechAPI Solutions',
    category: 'APIs',
    region: 'Europe',
    establishedYear: 2009,
    employeeCount: 180,
    annualRevenue: '$52M',
    facilities: ['Denmark', 'Sweden'],
    primaryContact: {
      name: 'Dr. Lars Nielsen',
      email: 'l.nielsen@biotechapi.dk',
      phone: '+45-33-45-67-89'
    },
    onboardingDate: '2018-10-20',
    status: 'active'
  },
  {
    id: 'SUP034',
    name: 'SynthChem Corporation',
    category: 'APIs',
    region: 'Asia Pacific',
    establishedYear: 2007,
    employeeCount: 250,
    annualRevenue: '$68M',
    facilities: ['Australia', 'New Zealand'],
    primaryContact: {
      name: 'Dr. Andrew Wilson',
      email: 'a.wilson@synthchem.au',
      phone: '+61-2-3456-7890'
    },
    onboardingDate: '2019-06-18',
    status: 'active'
  },

  // Additional Secondary Packaging
  {
    id: 'SUP035',
    name: 'EcoPackaging Solutions',
    category: 'Secondary Packaging',
    region: 'Europe',
    establishedYear: 2015,
    employeeCount: 130,
    annualRevenue: '$35M',
    facilities: ['Norway', 'Sweden'],
    primaryContact: {
      name: 'Dr. Astrid Hansen',
      email: 'a.hansen@ecopack.no',
      phone: '+47-22-34-56-78'
    },
    onboardingDate: '2021-09-05',
    status: 'active'
  },

  // Additional Testing Services
  {
    id: 'SUP036',
    name: 'MicrobiologyLabs Global',
    category: 'Testing Services',
    region: 'North America',
    establishedYear: 2010,
    employeeCount: 150,
    annualRevenue: '$42M',
    facilities: ['USA', 'Mexico'],
    primaryContact: {
      name: 'Dr. Maria Gonzalez',
      email: 'm.gonzalez@microlabs.com',
      phone: '+1-555-123-4567'
    },
    onboardingDate: '2020-07-08',
    status: 'active'
  },

  // Additional Logistics
  {
    id: 'SUP037',
    name: 'GlobalPharmaLogistics',
    category: 'Logistics',
    region: 'Asia Pacific',
    establishedYear: 2011,
    employeeCount: 400,
    annualRevenue: '$95M',
    facilities: ['Singapore', 'Hong Kong', 'Australia'],
    primaryContact: {
      name: 'Dr. Kevin Lim',
      email: 'k.lim@globallogistics.sg',
      phone: '+65-6234-5678'
    },
    onboardingDate: '2019-12-15',
    status: 'active'
  },

  // Additional Excipients
  {
    id: 'SUP038',
    name: 'FunctionalExcipients Ltd',
    category: 'Excipients',
    region: 'Europe',
    establishedYear: 2012,
    employeeCount: 75,
    annualRevenue: '$22M',
    facilities: ['Ireland'],
    primaryContact: {
      name: 'Dr. Fiona Murphy',
      email: 'f.murphy@funcexcip.ie',
      phone: '+353-1-345-6789'
    },
    onboardingDate: '2021-01-28',
    status: 'active'
  },

  // Additional Facility Equipment
  {
    id: 'SUP039',
    name: 'HVACPharma Systems',
    category: 'Facility Equipment',
    region: 'North America',
    establishedYear: 2009,
    employeeCount: 95,
    annualRevenue: '$28M',
    facilities: ['USA'],
    primaryContact: {
      name: 'Dr. Robert Kim',
      email: 'r.kim@hvacpharma.com',
      phone: '+1-555-234-5678'
    },
    onboardingDate: '2020-10-22',
    status: 'active'
  },

  // Additional Safety Equipment
  {
    id: 'SUP040',
    name: 'SafetyFirst Technologies',
    category: 'Safety Equipment',
    region: 'Europe',
    establishedYear: 2014,
    employeeCount: 60,
    annualRevenue: '$18M',
    facilities: ['Italy', 'Spain'],
    primaryContact: {
      name: 'Dr. Marco Rossi',
      email: 'm.rossi@safetyfirst.it',
      phone: '+39-02-345-6789'
    },
    onboardingDate: '2021-11-10',
    status: 'active'
  }
];

// Helper functions for supplier management
export function getSupplierById(id: string): SupplierMaster | undefined {
  return masterSuppliers.find(supplier => supplier.id === id);
}

export function getSuppliersByCategory(category: string): SupplierMaster[] {
  return masterSuppliers.filter(supplier => supplier.category === category);
}

export function getSuppliersByRegion(region: string): SupplierMaster[] {
  return masterSuppliers.filter(supplier => supplier.region === region);
}

export function getActiveSuppliers(): SupplierMaster[] {
  return masterSuppliers.filter(supplier => supplier.status === 'active');
}

export function getSupplierCategories(): string[] {
  return [...new Set(masterSuppliers.map(supplier => supplier.category))];
}

export function getSupplierRegions(): string[] {
  return [...new Set(masterSuppliers.map(supplier => supplier.region))];
}

// Statistics
export function getSupplierStats() {
  const total = masterSuppliers.length;
  const active = getActiveSuppliers().length;
  const categories = getSupplierCategories().length;
  const regions = getSupplierRegions().length;
  
  return {
    total,
    active,
    categories,
    regions,
    byCategory: getSupplierCategories().map(category => ({
      category,
      count: getSuppliersByCategory(category).length
    })),
    byRegion: getSupplierRegions().map(region => ({
      region,
      count: getSuppliersByRegion(region).length
    }))
  };
}