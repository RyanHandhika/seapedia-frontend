import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

// ── dummy reviews ────────────────────────────────────────────────
const DUMMY_REVIEWS = [
  {
    id: 1,
    name: "Andi Prasetyo",
    rating: 5,
    comment:
      "Belanja jadi lebih mudah! Tampilan aplikasinya bersih dan checkout-nya cepat banget.",
    role: "Buyer",
  },
  {
    id: 2,
    name: "Sari Dewi",
    rating: 5,
    comment:
      "Sebagai seller, fitur manajemen produknya sangat lengkap. Pesanan masuk langsung ternotifikasi.",
    role: "Seller",
  },
  {
    id: 3,
    name: "Budi Santoso",
    rating: 4,
    comment:
      "Sebagai driver, job list-nya jelas. Tinggal ambil, antar, selesai. Penghasilan juga transparan.",
    role: "Driver",
  },
];

// ── feature cards ────────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    title: "Easy shopping",
    desc: "Browse thousands of products from verified sellers. Add to cart and checkout in seconds.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    title: "Open your store",
    desc: "Create your store, manage products, and process orders from one clean seller dashboard.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      </svg>
    ),
    title: "Drive & earn",
    desc: "Pick up delivery jobs, complete them on your schedule, and track your earnings in real time.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Safe & secure",
    desc: "Wallet-based payments, order tracking, and automatic refunds for overdue deliveries.",
    color: "bg-purple-50 text-purple-600",
  },
];

// ── star component ───────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── review form ──────────────────────────────────────────────────
interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
}

// ── main page ────────────────────────────────────────────────────
export default function LandingPage() {
  const [reviews, setReviews] = useState(DUMMY_REVIEWS);
  const [form, setForm] = useState<ReviewFormData>({
    name: "",
    rating: 5,
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;

    // Sanitize: render as text only (XSS safe)
    const newReview = {
      id: reviews.length + 1,
      name: form.name.trim().slice(0, 80),
      rating: form.rating,
      comment: form.comment.trim().slice(0, 500),
      role: "Guest",
    };
    setReviews((prev) => [newReview, ...prev]);
    setForm({ name: "", rating: 5, comment: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600">
        {/* subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <Badge
              color="blue"
              className="mb-4 bg-white/20 text-white border-0 text-xs"
            >
              Multi-role marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Buy, sell, and deliver —
              <span className="block text-sky-200">all in one place.</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              SEAPEDIA connects buyers, sellers, and delivery drivers in one
              seamless marketplace experience. Shop smarter, sell easier, earn
              faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-white !text-primary-700 hover:bg-blue-50 shadow-lg font-semibold"
                >
                  Browse products
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Join SEAPEDIA
                </Button>
              </Link>
            </div>

            {/* trust stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: "10K+", label: "Products" },
                { value: "2K+", label: "Sellers" },
                { value: "5K+", label: "Buyers" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-blue-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              One platform, every role
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Whether you're here to shop, sell, or deliver — SEAPEDIA gives you
              the right tools for your role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} hover className="flex flex-col gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How SEAPEDIA works
            </h2>
            <p className="text-gray-500">
              From order to doorstep in three simple steps
            </p>
          </div>

          <div className="relative">
            {/* connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-primary-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  step: "01",
                  title: "Buyer shops",
                  desc: "Add products to cart and checkout using your wallet balance. Choose delivery method and apply discount codes.",
                },
                {
                  step: "02",
                  title: "Seller prepares",
                  desc: "Seller receives the order and packages the items. Once ready, the order becomes available for drivers.",
                },
                {
                  step: "03",
                  title: "Driver delivers",
                  desc: "A driver picks up the delivery job, takes the package, and confirms completion. You track it live.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-primary-50 border-4 border-white shadow-card flex items-center justify-center mb-5 relative z-10">
                    <span className="text-2xl font-bold text-primary-600">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What our users say
            </h2>
            <p className="text-gray-500">
              Real feedback from buyers, sellers, and drivers
            </p>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {reviews.slice(0, 6).map((r) => (
              <Card key={r.id} className="flex flex-col gap-3">
                <Stars rating={r.rating} />
                {/* render as text — XSS safe */}
                <p className="text-gray-700 text-sm leading-relaxed flex-1">
                  {r.comment}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {r.name}
                    </p>
                    <Badge
                      color={
                        r.role === "Seller"
                          ? "green"
                          : r.role === "Driver"
                            ? "amber"
                            : "blue"
                      }
                      className="text-xs"
                    >
                      {r.role}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Review form */}
          <div className="max-w-xl mx-auto">
            <Card className="border border-primary-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Share your experience
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Tell us what you think about SEAPEDIA — no purchase required.
              </p>

              {submitted && (
                <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Thanks for your review!
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="e.g. Andi Prasetyo"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, rating: n }))}
                        className="focus:outline-none"
                        aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                      >
                        <svg
                          className={`w-7 h-7 transition-colors ${n <= form.rating ? "text-amber-400" : "text-gray-200 hover:text-amber-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your comment
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="What do you think about SEAPEDIA?"
                    value={form.comment}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, comment: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.comment.length}/500
                  </p>
                </div>

                <Button type="submit" fullWidth>
                  Submit review
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of buyers, sellers, and drivers already using
            SEAPEDIA.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary-700 hover:bg-blue-50"
              >
                Create your account
              </Button>
            </Link>
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Browse first
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
