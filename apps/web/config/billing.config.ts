import { BillingProviderSchema, createBillingSchema } from '@kit/billing';

const provider = BillingProviderSchema.parse(
  process.env.NEXT_PUBLIC_BILLING_PROVIDER,
);

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'For founders running 1-2 agents in production',
      currency: 'USD',
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_vex_starter_monthly',
              name: 'Starter',
              cost: 29,
              type: 'flat',
            },
          ],
        },
        {
          name: 'Starter Yearly',
          id: 'starter-yearly',
          paymentType: 'recurring',
          interval: 'year',
          lineItems: [
            {
              id: 'price_vex_starter_yearly',
              name: 'Starter',
              cost: 290,
              type: 'flat',
            },
          ],
        },
      ],
      features: [
        '25,000 observations/mo',
        '1,000 verifications/mo',
        '100 corrections/mo',
        'Unlimited agents',
        '7-day retention',
        'Email support',
      ],
    },
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
              cost: 99,
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
              cost: 990,
              type: 'flat',
            },
          ],
        },
      ],
      features: [
        '150,000 observations/mo',
        '15,000 verifications/mo',
        'Full correction cascade',
        'Unlimited agents',
        '30-day retention',
        'Email + webhook alerts',
        'Email support (48h SLA)',
      ],
    },
    {
      id: 'team',
      name: 'Team',
      description: 'For organizations running agents at scale',
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
              cost: 349,
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
              cost: 3490,
              type: 'flat',
            },
          ],
        },
      ],
      features: [
        '1,500,000 observations/mo',
        '150,000 verifications/mo',
        'Full correction cascade + priority',
        'Unlimited agents',
        '90-day retention',
        'Email + webhook + Slack alerts',
        'Priority support (24h SLA)',
      ],
    },
  ],
});
