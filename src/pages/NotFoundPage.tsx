import { Link } from "react-router-dom";
import { Button, Logo } from "@/components/ui";

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-foam px-4">
      <div className="text-center">
        <Logo className="text-2xl" />
        <p className="mt-8 font-display text-6xl font-bold text-brand-500">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-ink-900">Page not found</h1>
        <p className="mt-1 text-sm text-ink-500">The page you're looking for doesn't exist or moved.</p>
        <Button className="mt-6"><Link to="/">Back to home</Link></Button>
      </div>
    </div>
  );
}
