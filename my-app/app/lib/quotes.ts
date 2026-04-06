export type Quote = {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientId: string;
  jobAddress: string;
  status: string;
  createdDate: string;
  expiryDate: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  gst: number;
  total: number;
  notes: string;
};

export const quotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'Q-2024-001',
    clientName: 'Olivia Hart',
    clientId: '1',
    jobAddress: '14 Baker Street, Melbourne, VIC 3000',
    status: 'Sent',
    createdDate: '2024-04-01',
    expiryDate: '2024-04-15',
    lineItems: [
      { description: 'Kitchen cabinets installation', quantity: 1, unitPrice: 15000, total: 15000 },
      { description: 'Countertop installation', quantity: 1, unitPrice: 5000, total: 5000 },
      { description: 'Appliance hookup', quantity: 1, unitPrice: 1000, total: 1000 },
    ],
    subtotal: 21000,
    gst: 2100,
    total: 23100,
    notes: 'Includes delivery and installation. Client prefers morning appointments.',
  },
  {
    id: '2',
    quoteNumber: 'Q-2024-002',
    clientName: 'Ethan Reed',
    clientId: '2',
    jobAddress: '9 River Road, Geelong, VIC 3220',
    status: 'Accepted',
    createdDate: '2024-03-28',
    expiryDate: '2024-04-11',
    lineItems: [
      { description: 'Bathroom renovation', quantity: 1, unitPrice: 12000, total: 12000 },
      { description: 'Tile work', quantity: 1, unitPrice: 3000, total: 3000 },
    ],
    subtotal: 15000,
    gst: 1500,
    total: 16500,
    notes: 'Client has approved the design. Ready to schedule.',
  },
  {
    id: '3',
    quoteNumber: 'Q-2024-003',
    clientName: 'Mia Carter',
    clientId: '3',
    jobAddress: '27 High Street, Bendigo, VIC 3550',
    status: 'Draft',
    createdDate: '2024-04-05',
    expiryDate: '2024-04-19',
    lineItems: [
      { description: 'Custom shelving', quantity: 5, unitPrice: 800, total: 4000 },
      { description: 'Installation', quantity: 1, unitPrice: 2000, total: 2000 },
    ],
    subtotal: 6000,
    gst: 600,
    total: 6600,
    notes: 'Awaiting final measurements from client.',
  },
];

export function getQuoteById(id: string) {
  return quotes.find((quote) => quote.id === id);
}