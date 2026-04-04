// STRAPI BACKEND: RAZORPAY SERVICE (src/api/subscription/services/razorpay.js)
// Note: This is a representation of the Strapi service logic.

const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {
  async createSubscription(userId, planType) {
    const planId = planType === 'yearly' ? process.env.RAZORPAY_YEARLY_PLAN_ID : process.env.RAZORPAY_MONTHLY_PLAN_ID;
    
    try {
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: planType === 'yearly' ? 12 : 60, // Example counts
        addons: [],
        notes: {
          userId: userId,
        },
      });

      return subscription;
    } catch (error) {
      throw error;
    }
  },

  async handleWebhook(payload, signature) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid signature');
    }

    const event = payload.event;
    const data = payload.payload;

    switch (event) {
      case 'subscription.activated':
      case 'subscription.charged':
        await this.updateSubscriptionStatus(data.subscription.entity, 'active');
        break;
      case 'subscription.cancelled':
        await this.updateSubscriptionStatus(data.subscription.entity, 'cancelled');
        break;
      case 'subscription.completed':
        await this.updateSubscriptionStatus(data.subscription.entity, 'completed');
        break;
      case 'payment.failed':
        // Handle failed payment
        break;
    }
  },

  async updateSubscriptionStatus(razorpaySub, status) {
    const userId = razorpaySub.notes.userId;
    
    // Update Subscriptions table
    const { data: sub, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        razorpay_subscription_id: razorpaySub.id,
        status: status,
        current_period_start: new Date(razorpaySub.current_start * 1000),
        current_period_end: new Date(razorpaySub.current_end * 1000),
        cancel_at_period_end: razorpaySub.cancel_at_period_end,
      }, { onConflict: 'razorpay_subscription_id' });

    // Update Profile
    if (status === 'active') {
      await supabase
        .from('profiles')
        .update({ active_subscription: true })
        .eq('id', userId);
    } else if (status === 'cancelled' || status === 'completed') {
      // Logic for deactivation is handled by Cron or checking period_end
    }
  }
};
