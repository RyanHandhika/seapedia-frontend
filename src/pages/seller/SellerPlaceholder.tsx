import { Construction } from "lucide-react";
import { Card } from "@components/ui/Card/Card";
interface P {
  title: string;
}
export default function SellerPlaceholder({ title }: P) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-display text-slate-800">
        {title}
      </h1>
      <Card>
        <div className="py-16 flex flex-col items-center text-center gap-3">
          <Construction size={40} className="text-amber-300" />
          <p className="text-slate-600 font-medium">
            Fitur ini akan hadir di Level 2
          </p>
          <p className="text-sm text-slate-400">
            Building the Seller Experience
          </p>
        </div>
      </Card>
    </div>
  );
}
