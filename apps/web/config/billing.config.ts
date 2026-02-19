import { BillingProviderSchema, createBillingSchema } from '@kit/billing';

const provider = BillingProviderSchema.parse(
  process.env.NEXT_PUBLIC_BILLING_PROVIDER,
);

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Most Popular',
      highlighted: true,
      description: 'For teams shipping agents to production',
      currency: 'USD',
      plans: [
        {
          name: 'Pro Monthly',
          id: 'pro-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_vex_pro_monthly',
              name: 'Pro',
              cost: 79,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Pro Yearly',
          id: 'pro-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_vex_pro_yearly',
              name: 'Pro',
              cost: 790,
              type: 'flat',
            },
          ],
        },
      ],
      features: [
        '100,000 observations/mo',
        '10,000 verifications/mo',
        '15 agents',
        '5 seats',
        '30-day retention',
        'Full correction cascade',
        'Email + webhook alerts',
        'Email support (48h SLA)',
      ],
    },
    {
      id: 'team',
      name: 'Team',
      description: 'For scaling teams with mission-critical agents',
      currency: 'USD',
      plans: [
        {
          name: 'Team Monthly',
          id: 'team-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_vex_team_monthly',
              name: 'Team',
              cost: 299,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Team Yearly',
          id: 'team-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_vex_team_yearly',
              name: 'Team',
              cost: 2990,
              type: 'flat',
            },
          ],
        },
      ],
      features: [
        '1,000,000 observations/mo',
        '100,000 verifications/mo',
        'Unlimited agents',
        '15 seats',
        '90-day retention',
        'Full correction cascade + priority',
        'Email + webhook + Slack alerts',
        'Priority support (24h SLA)',
      ],
    },
  ],
});
