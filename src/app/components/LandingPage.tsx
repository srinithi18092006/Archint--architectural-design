import { useNavigate } from "react-router";
import { Logo } from "./Logo";
import {
  ArrowRight,
  Layers,
  Ruler,
  Home,
  Droplets,
  Sparkles,
  CheckCircle2,
  Star,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-gold transition-colors">
              Home
            </a>
            <a href="#features" className="text-foreground hover:text-gold transition-colors">
              Features
            </a>
            <a href="#about" className="text-foreground hover:text-gold transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-gold transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl text-foreground hover:bg-muted transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 rounded-xl bg-gold text-gold-foreground hover:bg-gold/90 shadow-lg shadow-gold/20 transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered Architecture</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Design Your Dream Home with{" "}
                <span className="text-gold">Archint</span>
              </h1>

              <p className="text-xl text-white/80 leading-relaxed">
                Generate intelligent architectural plans based on your land size, floor count, room needs, and lifestyle preferences.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="group px-8 py-4 rounded-xl bg-gold text-gold-foreground hover:bg-gold/90 shadow-2xl shadow-gold/30 transition-all flex items-center gap-2"
                >
                  Start Archint
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                  Explore Features
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="flex items-center gap-1 text-gold mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm">Trusted by 10,000+ users</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-accent/30 blur-3xl rounded-full"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-4">
                  <div className="h-48 bg-gradient-to-br from-gold/20 to-accent/20 rounded-2xl flex items-center justify-center border border-white/10">
                    <Home className="w-24 h-24 text-white/60" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <Layers className="w-12 h-12 text-white/40" />
                    </div>
                    <div className="h-24 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <Ruler className="w-12 h-12 text-white/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features for Smart Planning
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to design your perfect architectural plan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "AI Floor Planning",
                description: "Intelligent multi-floor layouts optimized for your space and lifestyle",
                color: "accent",
              },
              {
                icon: Ruler,
                title: "Land Size Analysis",
                description: "Precise calculations and measurements for any plot dimensions",
                color: "gold",
              },
              {
                icon: Home,
                title: "Multi-Floor Design",
                description: "Create stunning plans for single or multi-story buildings",
                color: "accent",
              },
              {
                icon: Sparkles,
                title: "Room Optimization",
                description: "Smart room arrangements for maximum functionality and comfort",
                color: "gold",
              },
              {
                icon: Droplets,
                title: "Water & Utility Planning",
                description: "Comprehensive utility placement and plumbing solutions",
                color: "accent",
              },
              {
                icon: CheckCircle2,
                title: "Instant Generation",
                description: "Get complete architectural plans in seconds, not days",
                color: "gold",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-gold/50 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                    feature.color === "gold" ? "bg-gold/10" : "bg-accent/10"
                  }`}
                >
                  <feature.icon
                    className={`w-7 h-7 ${
                      feature.color === "gold" ? "text-gold" : "text-accent"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to your dream architectural plan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Requirements",
                description: "Provide your land dimensions, desired floors, rooms, and specific preferences",
              },
              {
                step: "02",
                title: "AI Generates Plans",
                description: "Our intelligent system creates optimized architectural designs tailored to your needs",
              },
              {
                step: "03",
                title: "Choose Your Favorite",
                description: "Review multiple AI-generated options and select the perfect design for your project",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-border h-full">
                  <div className="text-6xl font-bold text-gold/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Trusted by Architects & Homeowners
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users say about Archint
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Architect",
                content: "Archint revolutionized how I approach residential projects. The AI-generated layouts are incredibly precise and creative.",
              },
              {
                name: "Michael Chen",
                role: "Homeowner",
                content: "I designed my dream home in minutes! The platform is intuitive and the results exceeded my expectations.",
              },
              {
                name: "Emily Rodriguez",
                role: "Interior Designer",
                content: "The multi-floor planning feature is outstanding. It saves me hours of work and the designs are always practical.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                <div className="flex items-center gap-1 text-gold mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of satisfied users and start creating intelligent architectural plans today
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-5 rounded-xl bg-gold text-gold-foreground hover:bg-gold/90 shadow-2xl shadow-gold/30 transition-all inline-flex items-center gap-2"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="mb-6">
                <Logo />
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                Transform your architectural vision into reality with AI-powered intelligent planning. Design smarter, build better.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gold transition-colors flex items-center justify-center cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gold transition-colors flex items-center justify-center cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gold transition-colors flex items-center justify-center cursor-pointer">
                  <span className="text-sm">tw</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gold">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-white/70 hover:text-gold transition-colors">Home</a></li>
                <li><a href="#features" className="text-white/70 hover:text-gold transition-colors">Features</a></li>
                <li><a href="#about" className="text-white/70 hover:text-gold transition-colors">About</a></li>
                <li><a href="#" className="text-white/70 hover:text-gold transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gold">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>info@archint.com</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-2 text-white/70">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>123 Architecture Ave, Design City</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            <p>&copy; 2026 Archint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
