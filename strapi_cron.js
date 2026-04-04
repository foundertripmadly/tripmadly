// STRAPI CRON JOB (config/cron.js)

module.exports = {
  '0 0 * * *': async ({ strapi }) => {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const now = new Date().toISOString();

    // Find expired subscriptions that should be deactivated
    const { data: expiredSubs, error } = await supabase
      .from('subscriptions')
      .select('user_id')
      .lt('current_period_end', now)
      .eq('active_subscription', true);

    if (expiredSubs && expiredSubs.length > 0) {
      const userIds = expiredSubs.map(s => s.user_id);
      
      await supabase
        .from('profiles')
        .update({ active_subscription: false })
        .in('id', userIds);
        
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .in('user_id', userIds)
        .lt('current_period_end', now);
    }
    
    console.log(`Cron Job: Checked subscriptions at ${now}`);
  },
};
