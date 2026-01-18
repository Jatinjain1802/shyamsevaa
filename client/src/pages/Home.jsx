import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--color-secondary)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-[var(--color-text-dark)] mb-6 animate-in slide-in-from-bottom-4">
              Welcome to <span className="text-[var(--color-primary)]">ShyamSeva</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 animate-in slide-in-from-bottom-8 delay-200">
              Simplifying your spiritual journey. Book pandits, manage services, and connect with your dharmik community effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 delay-300">
              <Link to="/bookings" className="btn-primary-custom text-lg px-8 py-3">
                Book a Pooja
              </Link>
              <Link to="/about" className="btn-outline-custom text-lg px-8 py-3 !text-[var(--color-primary)] hover:!text-white border-[var(--color-primary)]">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Services Preview Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-[var(--color-text-dark)] mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Pooja Booking", desc: "Book experienced pandits for all your rituals and ceremonies." },
              { title: "Dharmshala", desc: "Find and book comfortable stays securely." },
              { title: "Matrimony", desc: "Connect with families within our trusted community." }
            ].map((service, index) => (
              <div key={index} className="card-dharmik group hover:-translate-y-2">
                <h3 className="text-xl font-bold mb-3 text-[var(--color-primary-dark)] group-hover:text-[var(--color-primary)] transition-colors">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
