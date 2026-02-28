import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>
          © 2026 <span className="font-semibold text-foreground">Hitesh & Webapps Software Solutions</span>. All rights reserved.
        </p>
        <a 
          href="https://webappssoft.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline font-medium transition-colors"
        >
          webappssoft.com
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </footer>
  );
}
