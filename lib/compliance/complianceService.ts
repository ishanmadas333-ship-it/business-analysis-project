import { ComplianceItem } from '@/types/business';

export const COMPLIANCE_DISCLAIMER = 
  'Regulatory information is provided for educational and decision support guidance only. Licensing norms, fees, and statutory requirements vary across municipal wards and state jurisdictions. Always verify current requirements with the relevant government authority or a qualified corporate legal / chartered accounting professional before commercial execution.';

/**
 * Returns tailored statutory compliance checklists for Indian businesses based on sector and location.
 */
export function getComplianceChecklist(businessType: string, city: string, state: string): ComplianceItem[] {
  const normalized = businessType.toLowerCase();

  const standardItems: ComplianceItem[] = [
    {
      id: 'cmp-gst',
      requirement: 'Goods & Services Tax (GST) Registration',
      purpose: 'Mandatory for interstate supply, e-commerce, and turnover above ₹20L (services) / ₹40L (goods). Required for issuing tax invoices.',
      issuingAuthority: 'Goods and Services Tax Network (GSTN), Ministry of Finance',
      estimatedTimeDays: 7,
      estimatedCostInr: 0,
      status: 'Mandatory Before Launch',
      officialSource: 'https://www.gst.gov.in',
      lastVerifiedDate: 'March 2026'
    },
    {
      id: 'cmp-udyam',
      requirement: 'MSME / Udyam Registration',
      purpose: 'Enables priority sector lending, lower interest credit guarantees (CGTMSE), and statutory protection against buyer delayed payments.',
      issuingAuthority: 'Ministry of MSME, Govt of India',
      estimatedTimeDays: 2,
      estimatedCostInr: 0,
      status: 'Recommended',
      officialSource: 'https://udyamregistration.gov.in',
      lastVerifiedDate: 'March 2026'
    },
    {
      id: 'cmp-trade',
      requirement: `${city} Municipal Corporation Trade License`,
      purpose: 'Statutory municipal permission to operate commercial or industrial premises within city jurisdiction.',
      issuingAuthority: `${city} Municipal Corporation`,
      estimatedTimeDays: 14,
      estimatedCostInr: 4500,
      status: 'Mandatory Before Launch',
      officialSource: 'Municipal Urban Local Body Portal',
      lastVerifiedDate: 'January 2026'
    }
  ];

  if (normalized.includes('water') || normalized.includes('beverage') || normalized.includes('food') || normalized.includes('cafe') || normalized.includes('kitchen')) {
    standardItems.unshift(
      {
        id: 'cmp-fssai',
        requirement: 'FSSAI State Manufacturing / Food Business License',
        purpose: 'Mandatory food safety compliance, kitchen hygiene inspection, and water mineral quality standards under FSS Act 2006.',
        issuingAuthority: `Food Safety and Standards Authority of India (${state} Division)`,
        estimatedTimeDays: 25,
        estimatedCostInr: 7500,
        status: 'Mandatory Before Launch',
        officialSource: 'https://foscos.fssai.gov.in',
        lastVerifiedDate: 'February 2026'
      }
    );
  }

  if (normalized.includes('water')) {
    standardItems.unshift(
      {
        id: 'cmp-bis',
        requirement: 'BIS Certification (ISI Mark under IS 14543)',
        purpose: 'Compulsory Bureau of Indian Standards certification scheme for Packaged Drinking Water manufacturing. Requires in-house laboratory.',
        issuingAuthority: 'Bureau of Indian Standards (BIS)',
        estimatedTimeDays: 45,
        estimatedCostInr: 25000,
        status: 'Mandatory Before Launch',
        officialSource: 'https://www.bis.gov.in (Scheme I)',
        lastVerifiedDate: 'February 2026'
      },
      {
        id: 'cmp-groundwater',
        requirement: `${state} Ground Water Authority Extraction NOC`,
        purpose: 'Regulatory clearance for borewell commercial water extraction or certified raw tanker supply agreement.',
        issuingAuthority: `${state} Ground Water Department`,
        estimatedTimeDays: 30,
        estimatedCostInr: 5000,
        status: 'Mandatory Before Launch',
        officialSource: `${state} Water Resources Portal`,
        lastVerifiedDate: 'January 2026'
      },
      {
        id: 'cmp-pcb',
        requirement: `${state} Pollution Control Board Consent (CFE & CFO)`,
        purpose: 'Consent for Establishment and Operation regarding reject wastewater discharge and pollution norms.',
        issuingAuthority: `${state} Pollution Control Board`,
        estimatedTimeDays: 21,
        estimatedCostInr: 6000,
        status: 'Mandatory Before Launch',
        officialSource: `${state} PCB Portal`,
        lastVerifiedDate: 'January 2026'
      }
    );
  }

  return standardItems;
}
