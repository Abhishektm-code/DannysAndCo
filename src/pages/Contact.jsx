import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black tracking-tighter text-stone-900 mb-4">
          GET IN TOUCH
        </h1>
        <p className="text-stone-500">
          We're here to help you with any questions or concerns.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          { icon: Mail, label: "Email", value: "growworldwide01@gmail.com" },
          { icon: Phone, label: "Phone", value: "+91 76765 28949" },
          { icon: MapPin, label: "Store", value: "Arasikere, Harapanahalli(T), India" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-10 rounded-4xl border border-stone-100 text-center hover:shadow-xl transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-50 rounded-xl mb-6">
              <item.icon className="text-stone-900" size={24} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">
              {item.label}
            </h3>
            <p className="text-stone-900 font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl shadow-stone-100 border border-stone-100 mb-20">
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                placeholder="Your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
              Message
            </label>
            <textarea
              className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all h-32 resize-none"
              placeholder="How can we help?"
            ></textarea>
          </div>

          <button className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-800 transition-all">
            Send Message
          </button>
        </form>
      </div>

      {/* Google Map */}
      <div className="w-full h-100 rounded-3xl overflow-hidden shadow-lg border border-stone-100">
        <iframe
          title="store-location"
          src="https://www.google.com/maps?q=14.6708339,76.0725497&z=15&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen=""
        ></iframe>
      </div>

    </div>
  );
}