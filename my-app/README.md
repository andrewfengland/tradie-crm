This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Manual QA Checklist

Use this checklist to manually verify key functionality after changes.

### Dashboard
- [ ] Page loads without errors
- [ ] Header displays correctly with "New quote" button
- [ ] Key metrics cards show sample data (Leads This Week, Quotes Sent, Won Jobs, Pipeline Value)
- [ ] Layout is mobile-friendly

### Contacts
- [ ] Page loads without errors
- [ ] Contact list displays with search and filters
- [ ] Clicking a contact name navigates to contact detail
- [ ] Layout is mobile-friendly

### Contact Detail
- [ ] Page loads for valid contact ID
- [ ] Displays contact information (name, company, role, phone, email, address, notes)
- [ ] "Back to contacts" link works
- [ ] Related quotes/jobs sections show placeholders
- [ ] Layout is mobile-friendly

### Opportunities
- [ ] Page loads without errors
- [ ] Opportunity list displays with search and filters
- [ ] Clicking an opportunity title navigates to opportunity detail
- [ ] Layout is mobile-friendly

### Opportunity Detail
- [ ] Page loads for valid opportunity ID
- [ ] Displays opportunity details (title, contact, stage, value, staff, source, notes)
- [ ] "Back to opportunities" link works
- [ ] Related quotes/jobs sections show placeholders
- [ ] Layout is mobile-friendly

### Pipeline
- [ ] Page loads without errors
- [ ] Displays pipeline view (placeholder or basic implementation)
- [ ] Layout is mobile-friendly

### Quotes
- [ ] Page loads without errors
- [ ] Displays quotes list (placeholder or basic implementation)
- [ ] Layout is mobile-friendly

### Jobs
- [ ] Page loads without errors
- [ ] Displays jobs list (placeholder or basic implementation)
- [ ] Layout is mobile-friendly
