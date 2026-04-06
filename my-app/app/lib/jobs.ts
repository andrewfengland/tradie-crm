export type Job = {
  id: string;
  jobNumber: string;
  clientName: string;
  clientId: string;
  siteAddress: string;
  status: string;
  assignedStaff: string;
  scheduledDate: string;
  scope: string;
  materialsNeeded: string[];
  notes: string;
};

export const jobs: Job[] = [
  {
    id: '1',
    jobNumber: 'J-2024-001',
    clientName: 'Olivia Hart',
    clientId: '1',
    siteAddress: '14 Baker Street, Melbourne, VIC 3000',
    status: 'In Progress',
    assignedStaff: 'John Doe',
    scheduledDate: '2024-04-10',
    scope: 'Kitchen renovation including cabinet installation, countertop replacement, and appliance hookup.',
    materialsNeeded: [
      'Kitchen cabinets (30 linear feet)',
      'Granite countertop (40 sq ft)',
      'Stainless steel appliances',
      'Tile backsplash (20 sq ft)',
    ],
    notes: 'Customer present during installation. Ensure morning schedule. Sand and seal existing floors after kitchen work.',
  },
  {
    id: '2',
    jobNumber: 'J-2024-002',
    clientName: 'Ethan Reed',
    clientId: '2',
    siteAddress: '9 River Road, Geelong, VIC 3220',
    status: 'Scheduled',
    assignedStaff: 'Jane Smith',
    scheduledDate: '2024-04-08',
    scope: 'Full bathroom renovation including new tiles, fixtures, and ventilation system.',
    materialsNeeded: [
      'Bathroom tiles (200 sq ft)',
      'Bathroom fixtures (sink, toilet, shower)',
      'Ventilation fan with ducting',
      'Waterproofing membrane',
    ],
    notes: 'Water must be shut off before 8 AM. Subcontractor plumber Mike Chen to handle rough-in work.',
  },
  {
    id: '3',
    jobNumber: 'J-2024-003',
    clientName: 'Mia Carter',
    clientId: '3',
    siteAddress: '27 High Street, Bendigo, VIC 3550',
    status: 'Completed',
    assignedStaff: 'Bob Johnson',
    scheduledDate: '2024-03-15',
    scope: 'Custom office shelving and desk installation.',
    materialsNeeded: [
      'Custom shelving units (5 units)',
      'Wooden desk top (6ft x 3ft)',
      'Desk frame and legs',
      'Mounting hardware',
    ],
    notes: 'Project completed ahead of schedule. Client very satisfied with quality. Final inspection passed.',
  },
];

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}