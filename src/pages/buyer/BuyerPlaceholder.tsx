import { Construction } from "lucide-react";
import { Card } from "@components/ui/Card/Card";

interface PlaceholderProps {
  title: string;
}

export default function BuyerPlaceholder({ title }: PlaceholderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display text-slate-800">
        {title}
      </h1>
      <Card>
        <div className="py-16 flex flex-col items-center text-center gap-3">
          <Construction size={40} className="text-teal-300" />
          <p className="text-slate-600 font-medium">
            Fitur ini akan hadir di Level 3
          </p>
          <p className="text-sm text-slate-400">
            Buyer Wallet, Cart &amp; Checkout
          </p>
        </div>
      </Card>
    </div>
  );
}
