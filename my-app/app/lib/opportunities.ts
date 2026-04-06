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
    stage: 'Quoted',
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
    stage: 'Follow Up',
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
    stage: 'Won',
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
    stage: 'New Lead',
    expectedCloseDate: '2024-06-01',
    estimatedValue: 30000,
    assignedStaff: 'Alice Brown',
    source: 'Social Media',
    notes: 'Emergency repair needed.',
  },
  {
    id: '5',
    title: 'Deck Construction',
    contactId: '5',
    contact: 'Priya Patel',
    stage: 'Contacted',
    expectedCloseDate: '2024-06-20',
    estimatedValue: 18500,
    assignedStaff: 'John Doe',
    source: 'Referral',
    notes: 'Timber deck with railing along back of property.',
  },
  {
    id: '6',
    title: 'Fence Replacement',
    contactId: '6',
    contact: 'Liam Brown',
    stage: 'New Lead',
    expectedCloseDate: '2024-07-01',
    estimatedValue: 7200,
    assignedStaff: 'Jane Smith',
    source: 'Website',
    notes: 'Colorbond fencing, 40m total.',
  },
  {
    id: '7',
    title: 'Garage Conversion',
    contactId: '7',
    contact: 'Sophie Williams',
    stage: 'Won',
    expectedCloseDate: '2024-03-28',
    estimatedValue: 22000,
    assignedStaff: 'Bob Johnson',
    source: 'Referral',
    notes: 'Converting double garage to home office.',
  },
  {
    id: '8',
    title: 'Pergola Install',
    contactId: '8',
    contact: 'James Chen',
    stage: 'Lost',
    expectedCloseDate: '2024-04-10',
    estimatedValue: 9500,
    assignedStaff: 'Alice Brown',
    source: 'Cold Call',
    notes: 'Customer went with a cheaper quote.',
  },
];

export function getOpportunityById(id: string) {
  return opportunities.find((opportunity) => opportunity.id === id);
}