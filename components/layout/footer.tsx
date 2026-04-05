import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              BrandName
            </span>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Building the future of [Your Niche]. Simple, fast, and secure.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/pricing" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Your Company, Inc. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
