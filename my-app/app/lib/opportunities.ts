export type Opportunity = {
  id: string;
  title: string;
  contactId: string;
  contact: string; // Contact name, linked to contacts
  stage: string;
  expectedCloseDate: string;
  estimatedValue: number;
  assignedStaff: string;
  source: string;
  notes: string;
};

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Kitchen Renovation',
    contactId: '1',
    contact: 'Olivia Hart',
    stage: 'Proposal',
    expectedCloseDate: '2024-05-15',
    estimatedValue: 25000,
    assignedStaff: 'John Doe',
    source: 'Referral',
    notes: 'Customer wants modern appliances and island bench.',
  },
  {
    id: '2',
    title: 'Bathroom Upgrade',
    contactId: '2',
    contact: 'Ethan Reed',
    stage: 'Negotiation',
    expectedCloseDate: '2024-04-30',
    estimatedValue: 15000,
    assignedStaff: 'Jane Smith',
    source: 'Website',
    notes: 'Includes new tiles and fixtures.',
  },
  {
    id: '3',
    title: 'Office Carpentry',
    contactId: '3',
    contact: 'Mia Carter',
    stage: 'Closed Won',
    expectedCloseDate: '2024-03-10',
    estimatedValue: 8000,
    assignedStaff: 'Bob Johnson',
    source: 'Cold Call',
    notes: 'Custom desks and shelving.',
  },
  {
    id: '4',
    title: 'Roof Replacement',
    contactId: '4',
    contact: 'Noah Turner',
    stage: 'Lead',
    expectedCloseDate: '2024-06-01',
    estimatedValue: 30000,
    assignedStaff: 'Alice Brown',
    source: 'Social Media',
    notes: 'Emergency repair needed.',
  },
];

export function getOpportunityById(id: string) {
  return opportunities.find((opportunity) => opportunity.id === id);
}