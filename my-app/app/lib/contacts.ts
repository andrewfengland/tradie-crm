export type Contact = {
  id: string;
  name: string;
  company: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Olivia Hart',
    company: 'Hart Electrical',
    role: 'Owner',
    phone: '(03) 9123 4567',
    email: 'olivia@hart-electrical.com',
    address: '14 Baker Street, Melbourne, VIC 3000',
    notes: 'Prefers email communication and morning site visits. Has a follow-up meeting next Thursday.',
  },
  {
    id: '2',
    name: 'Ethan Reed',
    company: 'Reed Plumbing',
    role: 'Project Manager',
    phone: '(03) 9876 5432',
    email: 'ethan@reedplumbing.com',
    address: '9 River Road, Geelong, VIC 3220',
    notes: 'Interested in a full bathroom renovation. Ask about new deposit terms.',
  },
  {
    id: '3',
    name: 'Mia Carter',
    company: 'Carter Carpentry',
    role: 'Lead Carpenter',
    phone: '(03) 9012 3456',
    email: 'mia@cartercarpentry.com',
    address: '27 High Street, Bendigo, VIC 3550',
    notes: 'Needs an updated quote for kitchen joinery and site visit availability.',
  },
  {
    id: '4',
    name: 'Noah Turner',
    company: 'Turner Roofing',
    role: 'Estimator',
    phone: '(03) 9234 5678',
    email: 'noah@turnerroofing.com',
    address: '81 King Street, Ballarat, VIC 3350',
    notes: 'Ready to schedule a site visit for roof repair quotes.',
  },
];

export function getContactById(id: string) {
  return contacts.find((contact) => contact.id === id);
}

export function updateContact(id: string, data: Partial<Omit<Contact, 'id'>>) {
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...data };
  }
}
