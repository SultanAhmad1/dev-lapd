## Getting Started

First, run the development server:

```bash
npm run dev
```
## Important Notes for Websites details.

The whole system (mean each website build-in via next js), is working dynamically.
The system - header and footer logo, svg icon details comming from database dynamically.

The system - menu (categories, items, item's modifier) comming from database, filter by brand and selected stores.
The system - order-type delivery and collection available, no worry you can controll this via toggle, on/off, (on active, off inactive).

The system - at axios where you have to provide brand GUID, to get brand related information from the database.
The system - js localStorage used to maintain some important things like cart, deliveryMatrix, selectedLocation.

The system - install packages, axios, react-query and stripe.