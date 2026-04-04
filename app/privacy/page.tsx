'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          <h1 className="text-4xl font-bold">Privacy Policy</h1>

          <p className="text-slate-600">
            This Privacy Policy describes how TripMadly collects, uses, and protects your information.
          </p>

          {/* Info Collection */}
          <div>
            <h2 className="text-xl font-bold">1. Information We Collect</h2>
            <p className="text-slate-600">
              We collect information such as your name, email address, and usage data when you use our platform.
            </p>
          </div>

          {/* Usage */}
          <div>
            <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
            <p className="text-slate-600">
              We use your information to provide and improve our services, personalize your experience, and process transactions.
            </p>
          </div>

          {/* Payments */}
          <div>
            <h2 className="text-xl font-bold">3. Payments & Subscriptions</h2>
            <p className="text-slate-600">
              All payments are securely processed via Razorpay. We do not store your card or payment details.
            </p>
          </div>

          {/* Affiliate */}
          <div>
            <h2 className="text-xl font-bold">4. Affiliate Disclaimer</h2>
            <p className="text-slate-600">
              TripMadly participates in affiliate programs. We may earn a commission when you book holidays, hotels or travel services through external links. We do not manage bookings, payments, or disputes related to third-party services.
            </p>
          </div>

          {/* Data Protection */}
          <div>
            <h2 className="text-xl font-bold">5. Data Protection</h2>
            <p className="text-slate-600">
              We implement industry-standard security measures to protect your data.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-xl font-bold">6. Cookies</h2>
            <p className="text-slate-600">
              We use cookies to enhance user experience and analyze usage.
            </p>
          </div>

          {/* Third Party */}
          <div>
            <h2 className="text-xl font-bold">7. Third-Party Services</h2>
            <p className="text-slate-600">
              We may use third-party tools and services (such as analytics and payment providers) which have their own privacy policies.
            </p>
          </div>

          {/* Rights */}
          <div>
            <h2 className="text-xl font-bold">8. Your Rights</h2>
            <p className="text-slate-600">
              You can request access, update, or deletion of your data at any time by contacting us.
            </p>
          </div>

          {/* Terms */}
          <div>
            <h2 className="text-xl font-bold">9. Terms & Conditions</h2>
            <p className="text-slate-600">
              By using TripMadly, you agree to use the platform only for lawful purposes. We are not responsible for third-party services, bookings, or travel-related issues arising from affiliate links.
            </p>
          </div>

          {/* Refund */}
          <div>
            <h2 className="text-xl font-bold">10. Refund Policy</h2>
            <p className="text-slate-600">
              All subscriptions (monthly and yearly) are non-refundable. Once a payment is made, no refunds will be issued under any circumstances.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold">11. Contact</h2>
            <p className="text-slate-600">
              For any privacy-related concerns, contact us at supporttripmadly@gmail.com
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}