import "./globals.css";
import Providers from "./providers.jsx";

export const metadata = {
  title: "KeepBirr - Expense & Wealth Tracker",
  description: "Track your expenses, manage budgets, and save smarter.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
