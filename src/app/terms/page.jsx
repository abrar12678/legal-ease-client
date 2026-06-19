"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] py-16 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Terms of Service</h1>
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
              { title: "1. Acceptance of Terms", content: "By accessing or using LegalEase, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of changes." },
              { title: "2. User Accounts", content: "Users must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Each person may maintain only one account. We reserve the right to suspend or terminate accounts that violate these terms." },
              { title: "3. Lawyer Listings", content: "Lawyers listed on LegalEase are independent professionals and not employees of the platform. We do not guarantee the outcome of any legal matter. All professionals undergo a verification process, but users should conduct their own due diligence before engaging services. Reviews and ratings reflect user opinions and are not endorsed by LegalEase." },
              { title: "4. Payments and Transactions", content: "All payments are processed through Stripe and are subject to Stripe's terms of service. LegalEase charges a platform fee which is disclosed before payment confirmation. Refunds are handled on a case-by-case basis and are subject to the specific terms agreed upon between the client and the lawyer." },
              { title: "5. Prohibited Conduct", content: "Users may not use the platform for illegal activities, harassment, spam, or submitting false reviews. Lawyers must maintain valid licenses and provide accurate credentials. Any attempt to manipulate the platform, bypass payment systems, or impersonate others will result in immediate account termination." },
              { title: "6. Limitation of Liability", content: "LegalEase provides a marketplace platform and is not a party to the legal services agreement between clients and lawyers. We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of our platform or the services provided by listed professionals." },
            ].map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-[#1B2A4A] mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-[#D4A843]" />
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
