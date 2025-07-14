// Regulatory Bodies Database
// This file contains all regulatory authorities and bodies

export interface RegulatoryBody {
  id: string;
  name: string;
  shortName: string;
  type: 'national' | 'international' | 'regional' | 'industry';
  region: string[];
  country?: string;
  website: string;
  description: string;
  scope: string[];
  contactInfo: {
    address?: string;
    phone?: string;
    email?: string;
  };
  standards: string[]; // Standard IDs they govern
  lastUpdated: string;
}

export const regulatoryBodies: RegulatoryBody[] = [
  // European Regulatory Bodies
  {
    id: 'REG001',
    name: 'European Medicines Agency',
    shortName: 'EMA',
    type: 'regional',
    region: ['Europe'],
    website: 'https://www.ema.europa.eu',
    description: 'European Union agency responsible for the scientific evaluation, supervision and safety monitoring of medicines',
    scope: ['Pharmaceuticals', 'Biologics', 'Veterinary medicines'],
    contactInfo: {
      address: 'Domenico Scarlattilaan 6, 1083 HS Amsterdam, Netherlands',
      phone: '+31 88 781 6000',
      email: 'info@ema.europa.eu'
    },
    standards: ['STD001'], // EU GMP
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG002',
    name: 'International Organization for Standardization',
    shortName: 'ISO',
    type: 'international',
    region: ['Global'],
    website: 'https://www.iso.org',
    description: 'International standard-setting body composed of representatives from national standards organizations',
    scope: ['Quality Management', 'Environmental Management', 'Medical Devices', 'Testing'],
    contactInfo: {
      address: 'Chemin de Blandonnet 8, 1214 Vernier, Geneva, Switzerland',
      phone: '+41 22 749 01 11',
      email: 'central@iso.org'
    },
    standards: ['STD002', 'STD007', 'STD008', 'STD009', 'STD010'], // ISO standards
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG003',
    name: 'European Chemicals Agency',
    shortName: 'ECHA',
    type: 'regional',
    region: ['Europe'],
    website: 'https://echa.europa.eu',
    description: 'European Union agency that manages the registration, evaluation, authorisation and restriction of chemicals',
    scope: ['Chemical Safety', 'REACH Regulation', 'CLP Regulation'],
    contactInfo: {
      address: 'Annankatu 18, 00120 Helsinki, Finland',
      phone: '+358 9 686 180',
      email: 'info@echa.europa.eu'
    },
    standards: ['STD003'], // REACH
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG004',
    name: 'United States Pharmacopeial Convention',
    shortName: 'USP',
    type: 'industry',
    region: ['North America', 'Global'],
    country: 'United States',
    website: 'https://www.usp.org',
    description: 'Scientific nonprofit organization that sets standards for the identity, strength, quality, and purity of medicines',
    scope: ['Pharmaceutical Standards', 'Compendial Standards', 'Reference Standards'],
    contactInfo: {
      address: '12601 Twinbrook Parkway, Rockville, MD 20852, USA',
      phone: '+1 301 881 0666',
      email: 'info@usp.org'
    },
    standards: ['STD004'], // USP <661>
    lastUpdated: '2024-01-01'
  },

  // North American Regulatory Bodies
  {
    id: 'REG005',
    name: 'Food and Drug Administration',
    shortName: 'FDA',
    type: 'national',
    region: ['North America'],
    country: 'United States',
    website: 'https://www.fda.gov',
    description: 'Federal agency responsible for protecting public health by regulating drugs, medical devices, food, and other products',
    scope: ['Pharmaceuticals', 'Medical Devices', 'Food Safety', 'Biologics'],
    contactInfo: {
      address: '10903 New Hampshire Avenue, Silver Spring, MD 20993, USA',
      phone: '+1 888 463 6332',
      email: 'webmail@fda.hhs.gov'
    },
    standards: ['STD005', 'STD006'], // FDA Registration, FDA DMF
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG006',
    name: 'European Commission',
    shortName: 'EU Commission',
    type: 'regional',
    region: ['Europe'],
    website: 'https://ec.europa.eu',
    description: 'Executive branch of the European Union responsible for proposing legislation and implementing decisions',
    scope: ['EU Directives', 'Packaging Regulations', 'Environmental Policy'],
    contactInfo: {
      address: 'Rue de la Loi 200, 1049 Brussels, Belgium',
      phone: '+32 2 299 11 11',
      email: 'info@ec.europa.eu'
    },
    standards: ['STD011'], // EU Packaging Directive
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG007',
    name: 'National Medicines Agencies',
    shortName: 'NMAs',
    type: 'national',
    region: ['Europe', 'Global'],
    website: 'https://www.hma.eu',
    description: 'Network of national medicines regulatory authorities in Europe',
    scope: ['Pharmaceutical Distribution', 'Good Distribution Practice', 'Pharmacovigilance'],
    contactInfo: {
      address: 'Various national agencies',
      email: 'contact via national agencies'
    },
    standards: ['STD012'], // GDP
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG008',
    name: 'National GLP Authorities',
    shortName: 'GLP Authorities',
    type: 'national',
    region: ['Global'],
    website: 'https://www.oecd.org/chemicalsafety/testing/good-laboratory-practice.htm',
    description: 'National authorities responsible for GLP compliance monitoring',
    scope: ['Good Laboratory Practice', 'Non-clinical Safety Studies', 'Laboratory Inspections'],
    contactInfo: {
      address: 'Various national authorities',
      email: 'contact via national authorities'
    },
    standards: ['STD013'], // GLP
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG009',
    name: 'Environmental Protection Agency',
    shortName: 'EPA',
    type: 'national',
    region: ['North America'],
    country: 'United States',
    website: 'https://www.epa.gov',
    description: 'Federal agency responsible for environmental protection and chemical safety regulation',
    scope: ['Chemical Safety', 'Environmental Protection', 'Toxic Substances Control'],
    contactInfo: {
      address: '1200 Pennsylvania Avenue NW, Washington, DC 20460, USA',
      phone: '+1 202 564 4700',
      email: 'info@epa.gov'
    },
    standards: ['STD014'], // TSCA
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG010',
    name: 'EU Notified Bodies',
    shortName: 'Notified Bodies',
    type: 'regional',
    region: ['Europe'],
    website: 'https://ec.europa.eu/growth/tools-databases/nando/',
    description: 'Organizations designated by EU member states to assess conformity of products before placing on market',
    scope: ['Medical Device Certification', 'CE Marking', 'Conformity Assessment'],
    contactInfo: {
      address: 'Various notified bodies across EU',
      email: 'contact via individual notified bodies'
    },
    standards: ['STD015'], // CE Marking
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG011',
    name: 'Forest Stewardship Council',
    shortName: 'FSC',
    type: 'international',
    region: ['Global'],
    website: 'https://fsc.org',
    description: 'International non-profit organization that promotes responsible management of forests',
    scope: ['Forest Management', 'Chain of Custody', 'Sustainable Packaging'],
    contactInfo: {
      address: 'Adenauerallee 134, 53113 Bonn, Germany',
      phone: '+49 228 367 660',
      email: 'info@fsc.org'
    },
    standards: ['STD016'], // FSC
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG012',
    name: 'European Directorate for the Quality of Medicines',
    shortName: 'EDQM',
    type: 'regional',
    region: ['Europe'],
    website: 'https://www.edqm.eu',
    description: 'Organization responsible for the European Pharmacopoeia and pharmaceutical care',
    scope: ['European Pharmacopoeia', 'CEP Certificates', 'Pharmaceutical Standards'],
    contactInfo: {
      address: '7 allée Kastner, 67000 Strasbourg, France',
      phone: '+33 3 88 41 30 30',
      email: 'info@edqm.eu'
    },
    standards: ['STD017'], // CEP
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG013',
    name: 'Health Canada',
    shortName: 'Health Canada',
    type: 'national',
    region: ['North America'],
    country: 'Canada',
    website: 'https://www.canada.ca/en/health-canada.html',
    description: 'Federal department responsible for helping Canadians maintain and improve their health',
    scope: ['Medical Devices', 'Pharmaceuticals', 'Health Products'],
    contactInfo: {
      address: 'Address Locator 0900C2, Ottawa, ON K1A 0K9, Canada',
      phone: '+1 613 957 2991',
      email: 'info@hc-sc.gc.ca'
    },
    standards: ['STD018'], // Health Canada MDL
    lastUpdated: '2024-01-01'
  },

  // Additional Regional Bodies
  {
    id: 'REG014',
    name: 'Medicines and Healthcare products Regulatory Agency',
    shortName: 'MHRA',
    type: 'national',
    region: ['Europe'],
    country: 'United Kingdom',
    website: 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency',
    description: 'UK government agency responsible for regulating medicines, medical devices and blood components',
    scope: ['Pharmaceuticals', 'Medical Devices', 'Blood Components'],
    contactInfo: {
      address: '10 South Colonnade, Canary Wharf, London E14 4PU, UK',
      phone: '+44 20 3080 6000',
      email: 'info@mhra.gov.uk'
    },
    standards: [],
    lastUpdated: '2024-01-01'
  },
  {
    id: 'REG015',
    name: 'Pharmaceuticals and Medical Devices Agency',
    shortName: 'PMDA',
    type: 'national',
    region: ['Asia Pacific'],
    country: 'Japan',
    website: 'https://www.pmda.go.jp/english/',
    description: 'Japanese regulatory agency for pharmaceuticals and medical devices',
    scope: ['Pharmaceuticals', 'Medical Devices', 'Regenerative Medicine'],
    contactInfo: {
      address: '3-3-2 Kasumigaseki, Chiyoda-ku, Tokyo 100-0013, Japan',
      phone: '+81 3 3506 9541',
      email: 'info@pmda.go.jp'
    },
    standards: [],
    lastUpdated: '2024-01-01'
  }
];

// Helper functions for regulatory bodies management
export function getRegulatoryBodyById(id: string): RegulatoryBody | undefined {
  return regulatoryBodies.find(body => body.id === id);
}

export function getRegulatoryBodiesByRegion(region: string): RegulatoryBody[] {
  return regulatoryBodies.filter(body => 
    body.region.includes(region) || body.region.includes('Global')
  );
}

export function getRegulatoryBodiesByType(type: string): RegulatoryBody[] {
  return regulatoryBodies.filter(body => body.type === type);
}

export function getRegulatoryBodiesByScope(scope: string): RegulatoryBody[] {
  return regulatoryBodies.filter(body => 
    body.scope.some(s => s.toLowerCase().includes(scope.toLowerCase()))
  );
}

export function getRegulatoryBodyStatistics() {
  const total = regulatoryBodies.length;
  const byType = {
    national: getRegulatoryBodiesByType('national').length,
    international: getRegulatoryBodiesByType('international').length,
    regional: getRegulatoryBodiesByType('regional').length,
    industry: getRegulatoryBodiesByType('industry').length
  };
  const byRegion = {
    global: getRegulatoryBodiesByRegion('Global').length,
    europe: getRegulatoryBodiesByRegion('Europe').length,
    northAmerica: getRegulatoryBodiesByRegion('North America').length,
    asiaPacific: getRegulatoryBodiesByRegion('Asia Pacific').length
  };
  
  return {
    total,
    byType,
    byRegion
  };
}