export const AGREEMENT_DETAILS_MOCKDATA = {
  id: 814,
  agreement_template_id: 1,
  agreement_events: [
    {
      type: 'texted',
      id: 705,
    },
  ],
  address: {
    city: 'North Chandlerfurt',
    county: null,
    id: 4,
    line1: '0391 Zieme Parks',
    line2: 'Bldg C',
    us_state: 'SD',
    postal_code: '85831',
  },
  addressByShippingAddressId: null,
  contact: {
    name_first: 'Jackie',
    name_last: 'Oberbrunner',
    id: 2,
  },
  contact_id: 2,
  line_items: [
    {
      agreement_id: 814,
      catalog_item_id: 1,
      current_cost: 155000,
      discount: 0,
      price: 270000,
      qty: 1,
      id: 897,
      order: null,
      taxable: true,
      catalog_item: {
        name: 'Elan SRE-3050',
      },
    },
    {
      agreement_id: 814,
      catalog_item_id: 12,
      current_cost: 23320,
      discount: 0,
      price: 50000,
      qty: 1,
      id: 898,
      order: null,
      taxable: true,
      catalog_item: {
        name: 'Automatic Folding Footrest',
      },
    },
  ],
  number: '13',
  revision: 0,
  sales_tax_rate: 8,
  shipping_address_id: null,
  signature: null,
  user: {
    prefix: 'LH',
    prefs: {
      passcode: null,
    },
    public_id: '8d806ff5-0c68-430c-956d-42f2f3dd3d87',
    name_last: 'Hermann',
    name_first: 'Lacy',
    google_id: null,
    email: 'elisha61@hotmail.com',
    default_sales_tax_rate: 8,
    organization_id: 1,
  },
  user_id: 1,
  created: '2020-08-21T16:30:58.921003+00:00',
  last_modified: '2020-09-05T21:17:19.131194+00:00',
  agreement_template: {
    name: 'Bruno Straight Stairlift',
    opts: {
      color: 'rgb(200, 170, 10)',
      payment_schedule: [
        {
          type: 'percentage',
          value: 0.1,
          description: 'Deposit',
        },
        {
          type: 'percentage',
          value: 0.9,
          description: 'Balance due upon installation',
        },
      ],
    },
    id: 1,
  },
};
