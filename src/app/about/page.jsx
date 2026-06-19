"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Shield, Award, Scale, ArrowRight, Heart, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-20 w-60 h-60 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              About <span className="text-[#D4A843]">LegalEase</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Empowering clients and legal professionals to connect, collaborate,
              and resolve legal matters with confidence and ease.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Target size={16} />
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-6">
                Making Legal Services Accessible to Everyone
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                LegalEase was founded with a simple yet powerful vision: to bridge the gap between
                clients seeking legal assistance and qualified legal professionals ready to help.
                We believe that everyone deserves access to quality legal counsel, regardless of
                their background or situation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our platform streamlines the process of finding, hiring, and managing legal
                services. Whether you are dealing with a corporate dispute, a family matter,
                or need guidance on immigration, LegalEase connects you with the right expert
                quickly and securely.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are committed to transparency, trust, and excellence in every interaction on
                our platform. Every lawyer on LegalEase is verified, and every transaction is
                protected through secure payment processing.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] rounded-2xl p-8 text-white"
            >
              <h3 className="text-xl font-bold mb-6 text-[#D4A843]">By the Numbers</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Users size={24} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">10,000+</p>
                    <p className="text-white/60 text-sm">Registered users and counting</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Scale size={24} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-white/60 text-sm">Verified legal professionals</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Award size={24} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">25,000+</p>
                    <p className="text-white/60 text-sm">Cases successfully resolved</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Shield size={24} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-white/60 text-sm">Secure and trusted platform</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-3">Our Core Values</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              These principles guide everything we do at LegalEase
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Trust & Security", desc: "Every lawyer is verified. Every payment is encrypted. Your data is protected with enterprise-grade security measures." },
              { icon: Scale, title: "Transparency", desc: "Clear pricing, honest reviews, and open communication. No hidden fees, no surprises — just straightforward legal services." },
              { icon: Heart, title: "Accessibility", desc: "Breaking down barriers to legal assistance. Our platform is designed to be intuitive and available to everyone, everywhere." },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#1B2A4A]/10 rounded-xl flex items-center justify-center mb-5">
                  <value.icon size={24} className="text-[#1B2A4A]" />
                </div>
                <h3 className="text-xl font-bold text-[#1B2A4A] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1B2A4A] mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8">Join thousands of users who trust LegalEase for their legal needs.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signUp" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] text-white font-semibold rounded-xl hover:bg-[#243A5E] transition-colors">
              Create Account <ArrowRight size={18} />
            </Link>
            <Link href="/browse-lawyers" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1B2A4A] text-[#1B2A4A] font-semibold rounded-xl hover:bg-[#1B2A4A]/5 transition-colors">
              Browse Lawyers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
