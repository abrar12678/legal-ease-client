"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {}
      <section className="relative bg-gradient-to-br from-[#1B2A4A] to-[#2D4A7A] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-20 w-60 h-60 border border-white/20 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Contact <span className="text-[#D4A843]">Us</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Have questions? We are here to help. Reach out to our team and we will
              respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <h2 className="text-2xl font-bold text-[#1B2A4A] mb-2">Get in Touch</h2>
              <p className="text-gray-500 mb-6">
                Choose your preferred way to reach us. Our team is available during business hours.
              </p>

              {[
                { icon: Mail, title: "Email Us", detail: "support@legalease.com", sub: "We reply within 24 hours" },
                { icon: Phone, title: "Call Us", detail: "+1 (555) 123-4567", sub: "Mon–Fri, 9 AM – 6 PM EST" },
                { icon: MapPin, title: "Visit Us", detail: "123 Legal Avenue, Suite 500", sub: "New York, NY 10001" },
                { icon: Clock, title: "Business Hours", detail: "Monday – Friday", sub: "9:00 AM – 6:00 PM EST" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#1B2A4A]/10 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-[#1B2A4A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B2A4A]">{item.title}</h3>
                    <p className="text-gray-800 font-medium mt-0.5">{item.detail}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare size={20} className="text-[#D4A843]" />
                  <h2 className="text-xl font-bold text-[#1B2A4A]">Send a Message</h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert("This is a frontend-only form. Backend integration coming soon!"); }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input type="text" placeholder="John Doe" required className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input type="email" placeholder="john@example.com" required className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                    <input type="text" placeholder="How can we help?" required className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea rows={5} placeholder="Describe your question or issue in detail..." required className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]/20 focus:border-[#1B2A4A]/30 resize-none" />
                  </div>

                  <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] text-white font-semibold rounded-xl hover:bg-[#243A5E] transition-colors">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
