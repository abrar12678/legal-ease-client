"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] py-16 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-white/60 text-sm">Last updated: June 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 space-y-8"
          >
            {[
              { title: "1. Information We Collect", content: "We collect personal information you provide when registering, including your name, email address, and role preference. We also collect usage data such as browsing patterns, search queries, and interaction history to improve our platform experience. Payment information is processed securely through Stripe and never stored on our servers." },
              { title: "2. How We Use Your Information", content: "Your information is used to provide and improve our legal services marketplace, facilitate communication between clients and lawyers, process payments, send important notifications about your account, and analyze platform usage to enhance user experience. We do not sell or rent your personal data to third parties." },
              { title: "3. Data Security", content: "We implement industry-standard security measures including encryption in transit (SSL/TLS), secure database storage, and regular security audits. Your authentication tokens are stored with expiration times and can be revoked. Payment data is handled entirely by Stripe, which is PCI DSS Level 1 compliant." },
              { title: "4. Cookies and Tracking", content: "We use essential cookies for authentication and session management. Analytics cookies may be used to understand how users interact with our platform. You can manage cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality." },
              { title: "5. Your Rights", content: "You have the right to access, update, or delete your personal data at any time through your dashboard settings. You may also request a complete export of your data or contact our support team for assistance. If you wish to permanently delete your account, please contact us directly." },
              { title: "6. Contact Us", content: "If you have questions about this Privacy Policy or your data, please contact us at privacy@legalease.com or through our Contact page. We aim to respond to all inquiries within 48 hours." },
            ].map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-[#1B2A4A] mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-[#D4A843]" />
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </motion.article>
        </div>
      </section>
    </div>
  );
}
