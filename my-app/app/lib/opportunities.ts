export type Opportunity = {
  id: string;
  title: string;
  contact: string; // Contact name, linked to contacts
  stage: string;
  estimatedValue: number;
  assignedStaff: string;
};

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Kitchen Renovation',
    contact: 'Olivia Hart',
    stage: 'Proposal',
    estimatedValue: 25000,
    assignedStaff: 'John Doe',
  },
  {
    id: '2',
    title: 'Bathroom Upgrade',
    contact: 'Ethan Reed',
    stage: 'Negotiation',
    estimatedValue: 15000,
    assignedStaff: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Office Carpentry',
    contact: 'Mia Carter',
    stage: 'Closed Won',
    estimatedValue: 8000,
    assignedStaff: 'Bob Johnson',
  },
  {
    id: '4',
    title: 'Roof Replacement',
    contact: 'Noah Turner',
    stage: 'Lead',
    estimatedValue: 30000,
    assignedStaff: 'Alice Brown',
  },
];