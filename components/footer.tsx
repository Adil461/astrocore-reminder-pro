import { Github, Linkedin, Twitter, Mail, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left section: Branding */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="text-sm font-semibold text-foreground">About Astrocore</h4>
            <div className="flex items-center gap-0">
              <img src="/astro_logo.gif" alt="Astrocore Logo" className="w-24 h-24 object-contain" />
              <span className="text-xl font-bold text-foreground">Astrocore Reminder Pro</span>
            </div>
            <p className="text-base text-muted-foreground text-center md:text-left leading-relaxed">
              Advanced task management and intelligent follow-up reminders designed to optimize your productivity workflow
            </p>
          </div>

          {/* Center section: Links */}
          <div className="flex flex-col items-center gap-3">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground text-center">
              <a href="#" className="hover:text-primary transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Right section: Social links */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h4 className="text-sm font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border my-6"></div>

        {/* Footer bottom: Credits */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="text-center md:text-left">
            Developed by <span className="font-semibold text-foreground">Roman</span>
          </p>

          <p className="text-center">© 2025 Astrocore Reminder Pro. All rights reserved.</p>

          <p className="text-center md:text-right">
            Powered by <span className="font-semibold text-primary">Astrocore</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
