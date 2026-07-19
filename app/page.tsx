"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { CONTACT_CONFIG } from "./config";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlignCenter,
  Award,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  Droplets,
  HeartPulse,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Microscope,
  Navigation,
  Phone,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

const PHONE_DISPLAY = CONTACT_CONFIG.phoneDisplay;
const PHONE = CONTACT_CONFIG.clinicPhone;
const MAP_URL = CONTACT_CONFIG.mapUrl;

const treatments: Array<{ icon: LucideIcon; title: string; subtitle: string; duration: string; rating: string; tone: string; image: string; imageAlt: string }> = [
  { icon: Activity, title: "Root Canal Treatment", subtitle: "Comfort-focused single-sitting RCT", duration: "1-2 visits", rating: "4.9", tone: "blue", image: "/assets/treatment-rct.jpg", imageAlt: "Dentist explaining a dental X-ray before root canal treatment in Hennur" },
  { icon: CircleDot, title: "Dental Implants", subtitle: "Natural-looking permanent tooth replacement", duration: "3-6 months", rating: "4.8", tone: "teal", image: "/assets/treatment-implants.jpg", imageAlt: "Dental implant specialist reviewing a 3D dental scan" },
  { icon: Sparkles, title: "Teeth Whitening", subtitle: "Professional whitening for a brighter smile", duration: "1 hour", rating: "4.9", tone: "violet", image: "/assets/treatment-smile.jpg", imageAlt: "Modern dental clinic for professional teeth whitening in Hennur" },
  { icon: AlignCenter, title: "Braces & Aligners", subtitle: "Personalised teeth-straightening options", duration: "12-24 months", rating: "4.7", tone: "pink", image: "/assets/treatment-rct.jpg", imageAlt: "Orthodontic consultation for braces and clear aligners" },
  { icon: Droplets, title: "Dental Cleaning", subtitle: "Gentle scaling, polishing and gum care", duration: "45 minutes", rating: "4.8", tone: "green", image: "/assets/treatment-smile.jpg", imageAlt: "Clean and advanced dental clinic for scaling and polishing" },
  { icon: Siren, title: "Emergency Dental Care", subtitle: "Prompt support for tooth pain and injuries", duration: "30 minutes", rating: "4.9", tone: "orange", image: "/assets/treatment-implants.jpg", imageAlt: "Dentist assessing an urgent dental concern in Hennur Bangalore" },
];

const faqs = [
  { question: "Which dental treatments are available at DentAlchemy in Hennur?", answer: "DentAlchemy provides general dental consultations, root canal treatment, dental implants, braces and clear aligners, teeth whitening, dental cleaning, dentures, tooth extraction, cosmetic dentistry, paediatric dentistry and emergency dental care in Hennur, Bangalore." },
  { question: "Do you provide emergency dental care near Hennur Bagalur Road?", answer: "Yes. Patients with sudden tooth pain, swelling, a broken tooth or a dental injury can call DentAlchemy for prompt guidance and an emergency appointment near Hennur Bagalur Main Road." },
  { question: "How can I book a dentist appointment in Hennur?", answer: "Choose a treatment and submit the appointment form, or use DentBot. Submit your details, and our team will contact you shortly to confirm your appointment slot." },
  { question: "Is DentAlchemy open on Sundays?", answer: "Yes. The clinic is open Monday to Saturday from 9:30 AM to 7:30 PM and Sunday from 9:30 AM to 5:30 PM." },
  { question: "Where is DentAlchemy dental clinic located?", answer: "DentAlchemy is located at #37, Mandala, Upper Ground, Hennur Bagalur Main Road, Sangam Enclave, Kothanur, Bengaluru, Karnataka 560077." },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dentist",
      "@id": "https://appointment.dentalchemy.in/#dentist",
      name: "DentAlchemy",
      url: "https://appointment.dentalchemy.in/",
      telephone: PHONE,
      email: "smiles@dentalchemy.in",
      image: "https://dentalchemy-appointment.abhishekgupta2341.chatgpt.site/assets/dental-hero.jpg",
      description: "DentAlchemy is a dental clinic in Hennur, Bangalore offering root canal treatment, dental implants, braces, clear aligners, teeth whitening, cleaning, paediatric dentistry and emergency dental care.",
      priceRange: "₹₹",
      address: { "@type": "PostalAddress", streetAddress: "#37, Mandala, Upper Ground, Hennur Bagalur Main Road, Sangam Enclave", addressLocality: "Bengaluru", addressRegion: "Karnataka", postalCode: "560077", addressCountry: "IN" },
      areaServed: ["Hennur", "Kothanur", "Hennur Bagalur Road", "North Bangalore"],
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "19:30" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:30", closes: "17:30" },
      ],
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "95" },
      sameAs: ["https://www.instagram.com/dentalchemy/"],
    },
    { "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ],
};

const doctors = [
  { image: "/assets/dr-annu.png", name: "Dr. Annu Pandey", role: "Pedodontist (Child Specialist)", bio: "As a founding partner and PEDODONTIST, Dr. Annu specializes in nurturing and caring for children. Being a mother herself, she adores working with kids. Her vision for providing advanced, comfortable care inspired DentAlchemy." },
  { image: "/assets/vignesh.png", name: "Vignesh Shetty", role: "Founding Partner & CXO", bio: "Vignesh, a proficient civil engineer, is a founding partner and CXO. He translates his technical acumen and keen eye for customer experience into dental technology, keeping every innovation patient-focused." },
  { image: "/assets/dr-abhijith.png", name: "Dr. Abhijith M.R", role: "Aesthetic Dentistry & Implantology", bio: "Dr. Abhijith combines an artistic eye with expertise in aesthetic dentistry and implantology to design dazzling smiles. As Chief Dental Officer, he keeps treatment precise, smooth and comfortable." },
  { image: "/assets/dr-ramya.png", name: "Dr. Ramyathilagam", role: "Orthodontist", bio: "Dr. Ramya is an orthodontist with an artistic flair. From intricate fillings to braces and aligners, she creates harmony between healthy function and beautiful aesthetics." },
];

const reviews = [
  { name: "Priya Sharma", treatment: "Root Canal Treatment", date: "2 weeks ago", quote: "Dr. Annu made my root canal completely painless! I was so scared but the entire procedure was comfortable. Single sitting RCT saved me multiple visits." },
  { name: "Rajesh Kumar", treatment: "Dental Implants", date: "1 month ago", quote: "Best dental implant dentist in Hennur! The implant looks and feels exactly like my natural tooth. Worth every penny!" },
  { name: "Sneha Reddy", treatment: "Teeth Whitening", date: "3 weeks ago", quote: "Amazing cosmetic dentist! My teeth whitening results were instant and natural-looking. The smile makeover completely transformed my confidence." },
  { name: "Arjun Patel", treatment: "Braces Treatment", date: "6 months ago", quote: "My ceramic braces treatment was smooth and comfortable. Regular check-ups and clear instructions throughout. My teeth are perfectly aligned now!" },
  { name: "Meera Singh", treatment: "Emergency Treatment", date: "1 week ago", quote: "Visited for severe tooth pain at night. The team provided immediate relief and proper treatment. Grateful for the urgent dental care!" },
  { name: "Vikram Joshi", treatment: "Dental Cleaning", date: "2 months ago", quote: "Professional dental cleaning and scaling done perfectly. The hygienist was gentle and thorough. My gums feel much healthier now." },
];

const treatmentOptions = ["General Consultation", "Dental Cleaning & Scaling", "Teeth Whitening", "Dental Implants", "Dentures", "Root Canal Treatment", "Braces & Orthodontics", "Tooth Extraction", "Emergency Dental Care", "Other Treatment"];

function goToForm(treatment?: string) {
  document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (treatment) window.setTimeout(() => window.dispatchEvent(new CustomEvent("select-treatment", { detail: treatment })), 350);
}

function AppointmentForm() {
  const [form, setForm] = useState({ name: "", phone: "", treatment: "", date: "", message: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = (event: Event) => setForm((old) => ({ ...old, treatment: (event as CustomEvent<string>).detail }));
      window.addEventListener("select-treatment", handler);
      return () => window.removeEventListener("select-treatment", handler);
    }
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^(?:\+91)?\d{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits, optionally starting with +91.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: "",
        city: "",
        preferredDate: form.date || "",
        preferredTime: "",
        message: `Treatment: ${form.treatment}. Message: ${form.message || "None"}`,
        source: "Landing Page Appointment Form"
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while submitting your request. Please try again.");
      }

      setSubmitted(true);
      setForm({ name: "", phone: "", treatment: "", date: "", message: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while submitting your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return (
    <div className="form-success">
      <div className="success-check"><CheckCircle2 aria-hidden="true" /></div>
      <h3>Appointment Request Received!</h3>
      <p>Thank you! Your appointment request has been received. Our team will contact you shortly.</p>
      <button className="gradient-button" onClick={() => { setSubmitted(false); }}>Book Another</button>
    </div>
  );

  return (
    <>
      <div className="form-heading"><h2>Book Your Appointment</h2><p>Get expert dental care - Schedule your visit today</p></div>
      <form className="appointment-form" onSubmit={submit}>
        <div className="form-row">
          <input required disabled={loading} placeholder="Your Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required disabled={loading} inputMode="tel" placeholder="Phone Number *" value={form.phone} maxLength={13} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, "") })} />
        </div>
        <select required disabled={loading} value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })}>
          <option value="">Select Treatment Needed *</option>
          {treatmentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
        <input type="date" disabled={loading} min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <textarea disabled={loading} placeholder="Any specific concerns or additional message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        {error && <p className="form-error">{error}</p>}
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? (
            <>Submitting...</>
          ) : (
            <>Book Appointment Now <ChevronRight aria-hidden="true" /></>
          )}
        </button>
        <small className="data-note"><LockKeyhole aria-hidden="true" /> Your details are securely processed to request an appointment. Our team will contact you shortly.</small>
      </form>
    </>
  );
}

function Chatbot({ onClose }: { onClose: () => void }) {
  const [choice, setChoice] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"service" | "name" | "phone" | "done">("service");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const chatOptions = ["General Consultation", "Dental Cleaning", "Teeth Whitening", "Dental Implants", "Dentures", "Root Canal Treatment", "Braces & Orthodontics", "Tooth Extraction", "Emergency Care"];

  function selectService(service: string) {
    setChoice(service);
    setStep("name");
    setError("");
  }

  function submitName(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    setError("");
    setStep("phone");
  }

  async function submitLead(event?: FormEvent) {
    event?.preventDefault();
    if (!/^(?:\+91)?\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number, optionally starting with +91.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        phone,
        email: "",
        city: "",
        preferredDate: "",
        preferredTime: "",
        message: `Service: ${choice}`,
        source: "Landing Page Chatbot"
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while submitting your request. Please try again.");
      }

      setStep("done");
} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong while submitting your request. Please try again.");
  }
} finally {
      setLoading(false);
    }
  }

  function restart() {
    setChoice("");
    setName("");
    setPhone("");
    setError("");
    setStep("service");
  }

  return (
    <div className="chat-panel" aria-label="DentBot appointment assistant">
      <div className="chat-header"><span className="bot-icon"><Bot aria-hidden="true" /></span><div><strong>DentBot</strong><small>Appointment Assistant</small></div><button aria-label="Close DentBot" onClick={onClose}><X aria-hidden="true" /></button></div>
      <div className="chat-content">
        <p className="bot-message">Hi! 👋 Welcome to DentAlchemy! I&apos;m here to help you book an appointment.</p>
        <p className="bot-message">Which treatment or service are you looking for?</p>
        {step === "service" && <div className="chat-options">{chatOptions.map((option) => <button key={option} onClick={() => selectService(option)}>{option}</button>)}</div>}

        {choice && <p className="user-message">{choice}</p>}

        {step === "name" && <>
          <p className="bot-message">Great choice! Please tell me your full name.</p>
          <form className="chat-entry" onSubmit={submitName}>
            <input autoFocus aria-label="Your full name" placeholder="Enter your full name" value={name} onChange={(event) => setName(event.target.value)} />
            {error && <small>{error}</small>}
            <button type="submit">Continue →</button>
          </form>
        </>}

        {step === "phone" && <>
          <p className="user-message">{name.trim()}</p>
          <p className="bot-message">Thanks, {name.trim().split(" ")[0]}! What is your 10-digit mobile number?</p>
          <form className="chat-entry" onSubmit={submitLead}>
            <input autoFocus disabled={loading} aria-label="10-digit mobile number" inputMode="numeric" maxLength={10} placeholder="Enter mobile number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} />
            {error && <small>{error}</small>}
            <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Appointment Request →"}</button>
          </form>
        </>}

        {step === "done" && <>
          <p className="user-message">{name.trim()} · {phone}</p>
          <div className="chat-complete">
            <span><CheckCircle2 aria-hidden="true" /></span>
            <strong>Request Received!</strong>
            <p>Thank you! Your appointment request has been received. Our team will contact you shortly.</p>
            <button className="text-button" onClick={restart}>Start a new request</button>
          </div>
        </>}
      </div>
      <div className="chat-progress"><span className={step !== "service" ? "active" : ""}>1 Service</span><span className={step === "phone" || step === "done" ? "active" : ""}>2 Name</span><span className={step === "done" ? "active" : ""}>3 Complete</span></div>
    </div>
  );
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 721px)");
    const frame = window.requestAnimationFrame(() => setChatOpen(desktop.matches));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header">
        <a href="#home" aria-label="DentAlchemy home"><Image src="/assets/logo.png" width={250} height={187} sizes="92px" priority alt="DentAlchemy Logo" /></a>
        <a className="header-call" href={`tel:${PHONE}`}><Phone aria-hidden="true" /> Call: {PHONE_DISPLAY}</a>
      </header>

      <section id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="rating-line"><span>★★★★★</span> Top-rated dental clinic in Hennur, Bangalore</div>
            <h1><span>Best Dentist in Hennur, Bangalore</span><br />for Painless, Expert Dental Care</h1>
            <p>Looking for a trusted dental clinic in Hennur? DentAlchemy provides root canal treatment, dental implants, braces and aligners, teeth whitening, kids dentistry and emergency dental care near Hennur Bagalur Road, Kothanur.</p>
            <div className="mini-stats">
              {[{icon:Users,value:'400+',label:'Happy Patients'},{icon:Award,value:'12+',label:'Years Experience'},{icon:Star,value:'95+',label:'5-Star Reviews'},{icon:Stethoscope,value:'4+',label:'Dental Experts'}].map(({icon:Icon,value,label}) => <div className="mini-stat" key={label}><i><Icon aria-hidden="true" /></i><strong>{value}</strong><small>{label}</small></div>)}
            </div>
            <div className="hero-actions"><a className="primary-pill" href={`tel:${PHONE}`}><Phone aria-hidden="true" /> Call Now: {PHONE_DISPLAY}</a><a className="outline-pill" href={MAP_URL} target="_blank"><Navigation aria-hidden="true" /> Get Directions</a></div>
            <div className="location-note"><MapPin aria-hidden="true" /> Hennur, Bangalore • Emergency dental support available</div>
            <div className="authentic-care"><span><CheckCircle2 aria-hidden="true" /></span><div><strong>Comfort-first dental care in Hennur</strong><small>Modern clinic • Advanced equipment • Friendly expert team</small></div></div>
          </div>
          <div id="hero-form" className="appointment-card"><AppointmentForm /></div>
        </div>
      </section>

      <section className="trusted section-pad">
        <div className="container">
          <div className="section-heading"><h2>Why Hennur Families Choose DentAlchemy</h2><p>Patient-focused dentistry, experienced clinicians and modern technology—conveniently located near Hennur Bagalur Main Road.</p></div>
          <div className="trust-stats">{[['400+','Happy Patients'],['12+','Years Experience'],['95+','5-Star Reviews'],['100%','Safe Treatment'],['7 Days','Open Weekly'],['Hennur','Prime Location']].map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
          <div className="feature-grid">
            <article><i className="feature-icon pink"><HeartPulse aria-hidden="true" /></i><h3>Emergency Dental Care</h3><p>Prompt support for tooth pain, swelling, broken teeth and urgent dental concerns in Hennur.</p></article>
            <article><i className="feature-icon blue"><Microscope aria-hidden="true" /></i><h3>Advanced Dental Technology</h3><p>Modern diagnostics and equipment support precise root canal, implant and restorative treatment planning.</p></article>
            <article><i className="feature-icon green"><ShieldCheck aria-hidden="true" /></i><h3>Experienced Dental Team</h3><p>Specialists in aesthetic dentistry, implantology, orthodontics and gentle dental care for children.</p></article>
          </div>
        </div>
      </section>

      <section id="treatments" className="treatments section-pad">
        <div className="container">
          <div className="section-heading"><h2>Dental Treatments in Hennur, Bangalore</h2><p>From preventive check-ups to advanced restorative and cosmetic dentistry, receive personalised care under one roof at DentAlchemy.</p></div>
          <div className="treatment-grid">
            {treatments.map((item) => { const TreatmentIcon = item.icon; return <article className={`treatment-card ${item.tone}`} key={item.title}>
              <Image className="treatment-image" src={item.image} width={900} height={650} sizes="(max-width: 720px) calc(100vw - 52px), 560px" alt={item.imageAlt} />
              <div className="treatment-top"><i><TreatmentIcon aria-hidden="true" /></i><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><span><Star aria-hidden="true" /> {item.rating}</span></div>
              <div className="treatment-meta"><div><strong>{item.duration}</strong><small>Duration</small></div><div><strong>Rated {item.rating}</strong><small>Patient Rating</small></div></div>
              <div className="card-actions"><button onClick={() => goToForm(item.title)}>Learn More</button><button onClick={() => goToForm(item.title)}>Book Now <ChevronRight aria-hidden="true" /></button></div>
            </article>})}
          </div>
        </div>
      </section>

      <section id="doctors" className="doctors section-pad">
        <div className="container">
          <div className="section-heading"><h2>Meet Our Dentists in Hennur</h2><p>Our experienced dental team combines specialist expertise, advanced techniques and personalised treatment planning for every patient.</p></div>
          <div className="doctor-grid">{doctors.map((doctor) => <article className="doctor-card" key={doctor.name}>
            <div className="doctor-image"><Image src={doctor.image} width={440} height={640} sizes="(max-width: 720px) calc(100vw - 24px), 190px" alt={`${doctor.name}, dentist at DentAlchemy in Hennur`} /></div><div className="doctor-copy"><h3>{doctor.name}</h3><strong>{doctor.role}</strong><p>{doctor.bio}</p><div><span>✓ Specialist</span><span>♡ Expert Care</span></div></div>
          </article>)}</div>
        </div>
      </section>

      <section id="testimonials" className="reviews section-pad">
        <div className="container">
          <div className="section-heading"><h2>Patient Reviews for DentAlchemy Hennur</h2><p>Read what patients say about their root canal, implant, whitening, braces and preventive dental care experience.</p><div className="review-score">★★★★★ <strong>4.9/5</strong> <span>| 95+ Reviews on Google</span></div></div>
          <div className="review-grid">{reviews.map((review) => <article className="review-card" key={review.name}>
            <div className="review-head"><div className="avatar">{review.name.charAt(0)}</div><div><h3>{review.name}</h3><strong>{review.treatment}</strong><small>{review.date}</small></div><b>G</b></div>
            <div className="review-stars">★★★★★</div><p>&ldquo;{review.quote}&rdquo;</p><div className="verified">✓ Verified Review <span>⭐ 5/5</span></div>
          </article>)}</div>
          <div className="reviews-cta"><h3>Join Our Happy Patients</h3><p>Experience the same exceptional care that our patients rave about. Book your appointment today and see why we&apos;re the most trusted dental clinic in Hennur.</p><div><a href="https://www.google.com/search?q=DentAlchemy+Hennur+reviews" target="_blank" className="outline-pill">Read More Reviews</a><button onClick={() => goToForm()} className="primary-pill">Book Your Appointment</button></div></div>
        </div>
      </section>

      <section id="faq" className="faq section-pad">
        <div className="container faq-layout">
          <div className="faq-intro">
            <span className="eyebrow"><Sparkles aria-hidden="true" /> Dental Care Questions</span>
            <h2>Frequently Asked Questions About Dentists in Hennur</h2>
            <p>Clear answers about treatments, emergency care, appointments, timings and our dental clinic location in North Bangalore.</p>
            <button className="primary-pill" onClick={() => goToForm()}>Book a Dental Consultation <ChevronRight aria-hidden="true" /></button>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<ChevronRight aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section id="contact" className="contact section-pad">
        <div className="container">
          <div className="section-heading"><h2>Visit Our Dental Clinic in Hennur</h2><p>DentAlchemy is conveniently located on Hennur Bagalur Main Road, near Kothanur in North Bangalore, with easy access and parking.</p></div>
          <div className="contact-grid">
            <iframe title="DentAlchemy clinic map" src="https://www.google.com/maps?q=DentAlchemy%20Hennur%20Bangalore&output=embed" loading="lazy" />
            <div className="contact-card">
              <div className="contact-info"><i><MapPin aria-hidden="true" /></i><div><h3>Our Address</h3><p>#37, Mandala, Upper Ground,<br />Hennur Bagalur Main Road<br />Sangam Enclave, Kothanur,<br />Bengaluru, Karnataka – 560077</p></div></div>
              <div className="contact-info"><i><Clock aria-hidden="true" /></i><div><h3>Smiling Hours</h3><p><b>Monday - Saturday</b><br />09:30 AM to 07:30 PM</p><p><b>Sunday</b><br />09:30 AM to 05:30 PM</p></div></div>
            </div>
          </div>
          <div className="contact-buttons"><a href={`tel:${PHONE}`}><Phone aria-hidden="true" /><span><b>Call DentAlchemy</b>{PHONE_DISPLAY}</span></a><a href="mailto:smiles@dentalchemy.in"><Mail aria-hidden="true" /><span><b>Email Us</b>smiles@dentalchemy.in</span></a><a href="https://www.instagram.com/dentalchemy/" target="_blank"><Camera aria-hidden="true" /><span><b>Follow Us</b>@dentalchemy</span></a></div>
          <div className="emergency-box"><div><strong>Need an Emergency Dentist in Hennur?</strong><p>For severe tooth pain, swelling, a broken tooth or dental injury, call DentAlchemy for prompt guidance.</p></div><a href={`tel:${PHONE}`}><Siren aria-hidden="true" /> Emergency Call: {PHONE_DISPLAY}</a></div>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div><div className="footer-brand"><span>D</span><div><h2>DentAlchemy</h2><p>Transforming Smiles in Hennur</p></div></div><p className="footer-contact-line"><Phone aria-hidden="true" /> {PHONE_DISPLAY}</p><p className="footer-contact-line"><Mail aria-hidden="true" /> smiles@dentalchemy.in</p><p className="footer-contact-line"><MapPin aria-hidden="true" /> <span>Hennur Bagalur Main Road<br />Sangam Enclave, Kothanur<br />Bengaluru - 560077</span></p><p className="footer-stars">★★★★★ <span>95+ Google Reviews</span></p></div>
          <div><h3>Quick Links</h3>{[['Home','#home'],['Treatments','#treatments'],['Doctors','#doctors'],['Testimonials','#testimonials'],['Contact','#contact']].map(([name,href])=><a key={name} href={href}>{name}</a>)}</div>
          <div><h3>Our Treatments</h3>{[...treatments.map((t)=>t.title),'Cosmetic Dentistry','Pediatric Dentistry'].map((name)=><span key={name}>{name}</span>)}</div>
          <div><h3>Smiling Hours</h3><b>Open 7 Days</b><p>Mon - Sat<br />09:30 AM - 07:30 PM</p><p>Sunday<br />09:30 AM - 05:30 PM</p><a href="https://www.instagram.com/dentalchemy/" target="_blank" className="instagram-link"><Camera aria-hidden="true" /> Follow us on Instagram</a></div>
        </div>
        <div className="footer-bottom">© 2024 DentAlchemy. All rights reserved. | Best Dentist in Hennur, Bangalore<br /><span>Emergency Dental Care &nbsp; | &nbsp; Painless Treatments &nbsp; | &nbsp; Expert Dentists</span></div>
      </footer>

      <div className="floating-actions" aria-label="Quick contact options"><a href={`tel:${PHONE}`} aria-label="Call DentAlchemy"><Phone aria-hidden="true" /><span>Call</span></a><a href={`https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hello, I am looking for an appointment.")}`} target="_blank" aria-label="Message DentAlchemy on WhatsApp"><MessageCircle aria-hidden="true" /><span>WhatsApp</span></a><button aria-label={chatOpen ? "Close DentBot" : "Open DentBot"} onClick={() => setChatOpen((open) => !open)}><Bot aria-hidden="true" /><span>DentBot</span></button></div>
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
    </main>
  );
}
