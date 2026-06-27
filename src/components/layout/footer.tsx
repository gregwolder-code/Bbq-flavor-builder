import Link from 'next/link';
import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">
              BBQ <span className="text-primary">Flavor</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Helping backyard cooks create competition-level flavors with simple 3-step recipe generation.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">App</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/builder" className="hover:text-primary">Recipe Builder</Link></li>
            <li><Link href="/recipes" className="hover:text-primary">Saved Recipes</Link></li>
            <li><Link href="/profile" className="hover:text-primary">My Profile</Link></li>
            <li><Link href="/admin" className="hover:text-primary">Admin Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/guides" className="hover:text-primary">Smoking Guides</Link></li>
            <li><Link href="/wood-pairings" className="hover:text-primary">Wood Pairings</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} BBQ Flavor Builder. All rights reserved.</p>
      </div>
    </footer>
  );
}
