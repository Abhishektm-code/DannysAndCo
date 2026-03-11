import React, { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Mail, Phone, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order in the 'My Orders' section of your profile. Once shipped, you'll see a tracking status update."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unworn items in their original packaging with tags attached."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping usually takes 3-5 business days. Express shipping is available for 1-2 day delivery."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship within India. International shipping is coming soon!"
  }
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Mock submission
  };

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif italic mb-4">Customer Support</h1>
          <p className="text-stone-500 max-w-2xl mx-auto">
            We're here to help. Whether you have a question about an order, a product, or just want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-stone-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-stone-500 mb-6">Chat with our support team in real-time.</p>
            <button className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">Start Chat</button>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-stone-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-stone-500 mb-6">We'll get back to you within 24 hours.</p>
            <a href="mailto:growworldwide01@gmail.com" className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">Send Email</a>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-stone-100 text-center shadow-sm">
            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-sm text-stone-500 mb-6">Mon - Sat, 9am - 6pm IST.</p>
            <a href="tel:+917676528949" className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-1">+91 76765 28949</a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <HelpCircle className="w-6 h-6 text-stone-900" />
              <h2 className="text-2xl font-serif italic">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-stone-100">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full py-4 flex items-center justify-between text-left hover:text-stone-600 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="pb-4 text-sm text-stone-500 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-stone-900 text-white p-10 rounded-3xl">
              <h2 className="text-2xl font-serif italic mb-6">Send us a Message</h2>
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-stone-400 text-sm">We've received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-stone-900 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-100 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
