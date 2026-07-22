import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart3, ShoppingCart, Users, DollarSign, Package,
  RefreshCw, ExternalLink, CreditCard, Truck, XCircle,
  Clock, FileText, Save, AlertCircle, Check, Eye,
  Plus, Trash2, Gift,
} from "lucide-react";
import { authClient } from "../../src/lib/auth-client";

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
  stripePaymentId: string | null;
  createdAt: string;
}

interface Donation {
  id: string;
  amount: number;
  donorName: string | null;
  donorEmail: string | null;
  message: string | null;
  status: string;
  stripePaymentId: string | null;
  createdAt: string;
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  image: string | null;
  createdAt: string;
  isAdmin?: boolean;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Order[];
}

export default function Page() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "money" | "events" | "members" | "content">("overview");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setSession(data);
      if (!data) {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, [session]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.admin))
      .catch(() => {});
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="size-8 text-maroon animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="size-8 text-maroon" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mb-8">
            Please sign in to access the dashboard.
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-maroon text-white font-bold tracking-wider uppercase text-sm rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {session.user?.name?.split(" ")[0] || "Admin"}
              </p>
            </div>
            <a
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-maroon hover:text-gold transition-colors"
            >
              View Site
            </a>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-6 mt-6 border-b border-gray-100 -mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 shrink-0 ${
                activeTab === "overview"
                  ? "border-maroon text-maroon"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Overview
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab("money")}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 shrink-0 ${
                    activeTab === "money"
                      ? "border-maroon text-maroon"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Money
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 shrink-0 ${
                    activeTab === "events"
                      ? "border-maroon text-maroon"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 shrink-0 ${
                    activeTab === "members"
                      ? "border-maroon text-maroon"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 shrink-0 ${
                    activeTab === "content"
                      ? "border-maroon text-maroon"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Content
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Stats Grid */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<DollarSign className="size-5" />}
                label="Total Revenue"
                value={`$${(stats?.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                color="text-green-600"
                bg="bg-green-50"
              />
              <StatCard
                icon={<ShoppingCart className="size-5" />}
                label="Total Orders"
                value={String(stats?.totalOrders || 0)}
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <StatCard
                icon={<Users className="size-5" />}
                label="Total Members"
                value={String(stats?.totalUsers || 0)}
                color="text-purple-600"
                bg="bg-purple-50"
              />
              <StatCard
                icon={<Package className="size-5" />}
                label="Order Statuses"
                value={String(Object.keys(stats?.ordersByStatus || {}).length)}
                sub={Object.entries(stats?.ordersByStatus || {}).map(
                  ([status, count]) => `${status}: ${count}`
                )}
                color="text-orange-600"
                bg="bg-orange-50"
              />
            </div>

            {/* Recent Orders */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-gray-900">
                  Recent Orders
                </h2>
              </div>
              <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Order</th>
                        <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Items</th>
                        <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Total</th>
                        <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Status</th>
                        <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Date</th>
                        <th className="text-right px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4"><span className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</span></td>
                          <td className="px-6 py-4"><div className="flex flex-col gap-0.5">{order.items.map((item, i) => (<span key={i} className="text-gray-700 text-xs">{item.quantity}x {item.name}</span>))}</div></td>
                          <td className="px-6 py-4 font-medium text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right"><a href={`/receipt/${order.id}`} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-maroon hover:text-gold transition-colors">View <ExternalLink className="size-3" /></a></td>
                        </tr>
                      ))}
                      {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "money" && <MoneyTab />}
      {activeTab === "events" && <EventsTab />}
      {activeTab === "members" && <MembersTab />}
      {activeTab === "content" && <AdminPanel />}
    </div>
  );
}

/* ---------- sub-components ---------- */

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string[];
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-full ${bg} ${color}`}>{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && (
        <div className="mt-2 flex flex-wrap gap-2">
          {sub.map((s, i) => (
            <span
              key={i}
              className="text-[0.55rem] font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="size-3.5" />,
  paid: <CreditCard className="size-3.5" />,
  shipped: <Truck className="size-3.5" />,
  cancelled: <XCircle className="size-3.5" />,
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.55rem] font-bold uppercase tracking-widest border ${style}`}
    >
      {statusIcons[status] || null}
      {status}
    </span>
  );
}

/* ── Admin Panel ─────────────────────────────────────────────────── */

interface DataFile {
  name: string;
  exists: boolean;
  size: number;
  lastModified: string | null;
}

const FILE_LABELS: Record<string, string> = {
  "site-config.json": "Site Configuration",
  "officers.json": "About Us — Officers & Board",
  "constitution.json": "About Us — Constitution & Bylaws",
  "gallery.json": "Gallery Photos",
  "home-carousel.json": "Home Page Carousel",
  "law-school-tours.json": "Law School Tours",
  "event-history.json": "Events Calendar",
  "resources.json": "Resources Page",
  "beyond-the-bar.json": "Beyond the Bar",
  "merchandise.json": "Merchandise Products",
  "admin-config.json": "Admin Access Settings",
};

const FILE_DESCRIPTIONS: Record<string, string> = {
  "site-config.json": "Organization name, social links, Stripe settings, form URLs",
  "officers.json": "Officer names, roles, photos, and bios for each year",
  "constitution.json": "Full constitution text with articles and sections",
  "gallery.json": "Gallery image paths and captions",
  "home-carousel.json": "Hero carousel slides on the home page",
  "law-school-tours.json": "Law school tour listings with dates and descriptions",
  "event-history.json": "Event listings shown on the events page",
  "resources.json": "Resources and download links",
  "beyond-the-bar.json": "Beyond the Bar program content",
  "merchandise.json": "Product listings for the merchandise page",
  "admin-config.json": "List of email addresses with admin access",
};

function AdminPanel() {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/data-files")
      .then((r) => r.json())
      .then((data) => setFiles(data.files || []))
      .catch(() => {});
  }, []);

  const openFile = async (name: string) => {
    setSelectedFile(name);
    setJsonError("");
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/data/${name}`);
      const data = await res.json();
      setJsonContent(JSON.stringify(JSON.parse(data.content), null, 2));
    } catch {
      setJsonContent("{\n  \"error\": \"Failed to load file\"\n}");
    }
  };

  const validateAndFormat = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
      setJsonError("");
      return parsed;
    } catch (e: any) {
      setJsonError(e.message);
      return null;
    }
  };

  const saveFile = async () => {
    const parsed = validateAndFormat();
    if (!parsed || !selectedFile) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/data/${selectedFile}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(parsed, null, 2) }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg({ type: "success", text: "Saved successfully!" });
      } else {
        setSaveMsg({ type: "error", text: data.error || "Save failed" });
      }
    } catch {
      setSaveMsg({ type: "error", text: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-bold text-gray-900">Content Admin</h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit JSON data files that power the site&apos;s content. Changes take effect immediately.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* File List */}
        <div className="lg:w-72 shrink-0 space-y-1">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => openFile(file.name)}
              className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all border-l-2 ${
                selectedFile === file.name
                  ? "border-maroon bg-maroon/5 text-maroon font-semibold"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-widest">
                {FILE_LABELS[file.name] || file.name}
              </span>
              <span className="block text-[0.6rem] text-gray-400 mt-0.5">
                {file.exists ? `${(file.size / 1024).toFixed(1)} KB` : "—"}
              </span>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900">
                    {FILE_LABELS[selectedFile] || selectedFile}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {FILE_DESCRIPTIONS[selectedFile] || ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saveMsg && (
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${
                      saveMsg.type === "success" ? "text-green-600" : "text-red-500"
                    }`}>
                      {saveMsg.type === "success" ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                      {saveMsg.text}
                    </span>
                  )}
                  <button
                    onClick={saveFile}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-maroon text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-maroon/90 transition-all disabled:opacity-50"
                  >
                    <Save className="size-3.5" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              {/* JSON Editor */}
              <div className="relative">
                <textarea
                  value={jsonContent}
                  onChange={(e) => { setJsonContent(e.target.value); setJsonError(""); setSaveMsg(null); }}
                  className={`w-full h-[500px] font-mono text-sm p-4 border rounded-sm focus:outline-none focus:ring-1 resize-y ${
                    jsonError ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-maroon/20 focus:border-maroon"
                  }`}
                  spellCheck={false}
                />
                <button
                  onClick={validateAndFormat}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-gray-100 text-gray-500 text-[0.55rem] font-bold uppercase tracking-widest rounded-sm hover:bg-gray-200 transition-colors"
                >
                  Format
                </button>
              </div>
              {jsonError && (
                <p className="text-red-500 text-xs flex items-center gap-1.5">
                  <AlertCircle className="size-3.5" />
                  {jsonError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <FileText className="size-12 text-gray-200 mb-4" />
              <p className="text-gray-400 italic">Select a file from the list to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Money Tab ──────────────────────────────────────────────────── */

function MoneyTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/donations").then((r) => r.json()),
      fetch("/api/dashboard/orders").then((r) => r.json()),
    ]).then(([d, o]) => {
      setDonations(d);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex items-center justify-center h-64">
        <RefreshCw className="size-6 text-maroon animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + o.total, 0);
  const totalDonations = donations
    .filter((d) => d.status === "paid")
    .reduce((s, d) => s + d.amount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="size-5" />}
          label="Revenue (Orders)"
          value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          icon={<Gift className="size-5" />}
          label="Donations Received"
          value={`$${totalDonations.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<ShoppingCart className="size-5" />}
          label="Total Orders"
          value={String(orders.length)}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="size-5" />}
          label="Pending Orders"
          value={String(pendingCount)}
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      {/* Donations Table */}
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Donations</h2>
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Donor</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Amount</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Message</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{d.donorName || "—"}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{d.donorEmail || "—"}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">${d.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate">{d.message || "—"}</td>
                    <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No donations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* All Orders */}
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">All Orders</h2>
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Order</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Items</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Total</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Date</th>
                  <th className="text-right px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</span></td>
                    <td className="px-6 py-4"><div className="flex flex-col gap-0.5">{order.items.map((item, i) => (<span key={i} className="text-gray-700 text-xs">{item.quantity}x {item.name}</span>))}</div></td>
                    <td className="px-6 py-4 font-medium text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right"><a href={`/receipt/${order.id}`} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-maroon hover:text-gold transition-colors">View <ExternalLink className="size-3" /></a></td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Events Tab ─────────────────────────────────────────────────── */

interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  longDescription?: string;
  links?: { name: string; url: string }[];
  image?: string;
}

interface TourSchool {
  name: string;
  location: string;
  date: string;
  status: string;
  image: string;
  description: string;
  signupLink: string;
}

interface TourYear {
  year: string;
  schools: TourSchool[];
}

function EventsTab() {
  const [activeSection, setActiveSection] = useState<"events" | "tours">("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tours, setTours] = useState<TourYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evRes, tourRes] = await Promise.all([
        fetch("/api/admin/data/event-history.json"),
        fetch("/api/admin/data/law-school-tours.json"),
      ]);
      const evData = await evRes.json();
      const tourData = await tourRes.json();
      setEvents(JSON.parse(evData.content));
      setTours(JSON.parse(tourData.content).tours || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const saveFile = async (fileName: string, content: any) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/data/${fileName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(content, null, 2) }),
      });
      const data = await res.json();
      setSaveMsg(data.success ? { type: "success", text: "Saved!" } : { type: "error", text: data.error || "Save failed" });
    } catch {
      setSaveMsg({ type: "error", text: "Failed to save" });
    }
    setSaving(false);
  };

  const addEvent = () => {
    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: "",
      date: "",
      description: "",
      longDescription: "",
      links: [],
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (idx: number, field: string, value: string) => {
    const updated = [...events];
    (updated[idx] as any)[field] = value;
    setEvents(updated);
  };

  const deleteEvent = (idx: number) => {
    setEvents(events.filter((_, i) => i !== idx));
  };

  const addTourSchool = () => {
    const currentYear = tours[0]?.year || "2025–2026";
    const newSchool: TourSchool = {
      name: "", location: "", date: "", status: "Upcoming",
      image: "", description: "", signupLink: "",
    };
    const updated = [...tours];
    if (updated.length === 0) {
      updated.push({ year: currentYear, schools: [newSchool] });
    } else {
      updated[0].schools.push(newSchool);
    }
    setTours(updated);
  };

  const updateTourSchool = (yearIdx: number, schoolIdx: number, field: string, value: string) => {
    const updated = [...tours];
    (updated[yearIdx].schools[schoolIdx] as any)[field] = value;
    setTours(updated);
  };

  const deleteTourSchool = (yearIdx: number, schoolIdx: number) => {
    const updated = [...tours];
    updated[yearIdx].schools = updated[yearIdx].schools.filter((_, i) => i !== schoolIdx);
    if (updated[yearIdx].schools.length === 0) {
      setTours(updated.filter((_, i) => i !== yearIdx));
    } else {
      setTours(updated);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex items-center justify-center h-64">
        <RefreshCw className="size-6 text-maroon animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">Events Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage event history and law school tours.</p>
        </div>
        {saveMsg && (
          <span className={`text-xs font-bold flex items-center gap-1.5 ${saveMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {saveMsg.type === "success" ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
            {saveMsg.text}
          </span>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveSection("events")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
            activeSection === "events" ? "border-maroon text-maroon" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Event History
        </button>
        <button
          onClick={() => setActiveSection("tours")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
            activeSection === "tours" ? "border-maroon text-maroon" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Law School Tours
        </button>
      </div>

      {activeSection === "events" && (
        <div className="space-y-4">
          {events.map((ev, i) => (
            <div key={ev.id} className="bg-white rounded-sm border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Title</label>
                      <input value={ev.title} onChange={(e) => updateEvent(i, "title", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                    </div>
                    <div>
                      <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Date</label>
                      <input value={ev.date} onChange={(e) => updateEvent(i, "date", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                    </div>
                    <div>
                      <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Image URL</label>
                      <input value={ev.image || ""} onChange={(e) => updateEvent(i, "image", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Short Description</label>
                    <input value={ev.description} onChange={(e) => updateEvent(i, "description", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                  </div>
                  <div>
                    <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Long Description</label>
                    <textarea value={ev.longDescription || ""} onChange={(e) => updateEvent(i, "longDescription", e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 resize-y" />
                  </div>
                </div>
                <button onClick={() => deleteEvent(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-colors shrink-0">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={addEvent} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-200 transition-colors">
              <Plus className="size-3.5" /> Add Event
            </button>
            <button onClick={() => saveFile("event-history.json", events)} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-maroon text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-maroon/90 transition-all disabled:opacity-50">
              <Save className="size-3.5" /> {saving ? "Saving..." : "Save Events"}
            </button>
          </div>
        </div>
      )}

      {activeSection === "tours" && (
        <div className="space-y-4">
          {tours.map((year, yi) => (
            <div key={year.year}>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">{year.year}</h3>
              <div className="space-y-3">
                {year.schools.map((school, si) => (
                  <div key={si} className="bg-white rounded-sm border border-gray-200 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">School Name</label>
                          <input value={school.name} onChange={(e) => updateTourSchool(yi, si, "name", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Location</label>
                          <input value={school.location} onChange={(e) => updateTourSchool(yi, si, "location", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Date</label>
                          <input value={school.date} onChange={(e) => updateTourSchool(yi, si, "date", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</label>
                          <select value={school.status} onChange={(e) => updateTourSchool(yi, si, "status", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white">
                            <option>Upcoming</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Description</label>
                          <textarea value={school.description} onChange={(e) => updateTourSchool(yi, si, "description", e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 resize-y" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Image URL</label>
                          <input value={school.image} onChange={(e) => updateTourSchool(yi, si, "image", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Signup Link</label>
                          <input value={school.signupLink} onChange={(e) => updateTourSchool(yi, si, "signupLink", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                      </div>
                      <button onClick={() => deleteTourSchool(yi, si)} className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-colors shrink-0">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={addTourSchool} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-200 transition-colors">
              <Plus className="size-3.5" /> Add School Tour
            </button>
            <button onClick={() => saveFile("law-school-tours.json", { tours })} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-maroon text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-maroon/90 transition-all disabled:opacity-50">
              <Save className="size-3.5" /> {saving ? "Saving..." : "Save Tours"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Members Tab ────────────────────────────────────────────────── */

interface Officer {
  role: string;
  name: string;
  imageFileName: string;
  bio: string;
}

interface OfficerYear {
  year: string;
  members: Officer[];
}

function MembersTab() {
  const [activeSection, setActiveSection] = useState<"users" | "officers" | "admin-config">("users");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [officers, setOfficers] = useState<OfficerYear[]>([]);
  const [adminEmails, setAdminEmails] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, oRes, aRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/data/officers.json"),
        fetch("/api/admin/data/admin-config.json"),
      ]);
      setUsers(await uRes.json());
      const oData = await oRes.json();
      setOfficers(JSON.parse(oData.content));
      const aData = await aRes.json();
      const config = JSON.parse(aData.content);
      setAdminEmails(config.admins.join("\n"));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const saveAdminConfig = async () => {
    setSaving(true);
    setSaveMsg(null);
    const admins = adminEmails.split("\n").map((s) => s.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/admin/data/admin-config.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify({ admins }, null, 2) }),
      });
      const data = await res.json();
      setSaveMsg(data.success ? { type: "success", text: "Saved!" } : { type: "error", text: data.error || "Save failed" });
    } catch {
      setSaveMsg({ type: "error", text: "Failed to save" });
    }
    setSaving(false);
  };

  const saveOfficers = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/admin/data/officers.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(officers, null, 2) }),
      });
      const data = await res.json();
      setSaveMsg(data.success ? { type: "success", text: "Saved!" } : { type: "error", text: data.error || "Save failed" });
    } catch {
      setSaveMsg({ type: "error", text: "Failed to save" });
    }
    setSaving(false);
  };

  const updateOfficer = (yearIdx: number, memberIdx: number, field: string, value: string) => {
    const updated = [...officers];
    (updated[yearIdx].members[memberIdx] as any)[field] = value;
    setOfficers(updated);
  };

  const addOfficer = () => {
    const yearIdx = officers.length > 0 ? 0 : 0;
    const newOfficer: Officer = { role: "", name: "", imageFileName: "", bio: "" };
    const updated = [...officers];
    if (updated.length === 0) {
      updated.push({ year: "2025–2026", members: [newOfficer] });
    } else {
      updated[yearIdx].members.push(newOfficer);
    }
    setOfficers(updated);
  };

  const deleteOfficer = (yearIdx: number, memberIdx: number) => {
    const updated = [...officers];
    updated[yearIdx].members = updated[yearIdx].members.filter((_, i) => i !== memberIdx);
    setOfficers(updated);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex items-center justify-center h-64">
        <RefreshCw className="size-6 text-maroon animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">Members</h2>
          <p className="text-sm text-gray-500 mt-1">Manage members, officers, and admin access.</p>
        </div>
        {saveMsg && (
          <span className={`text-xs font-bold flex items-center gap-1.5 ${saveMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {saveMsg.type === "success" ? <Check className="size-3.5" /> : <AlertCircle className="size-3.5" />}
            {saveMsg.text}
          </span>
        )}
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveSection("users")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeSection === "users" ? "border-maroon text-maroon" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Registered Users
        </button>
        <button
          onClick={() => setActiveSection("officers")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeSection === "officers" ? "border-maroon text-maroon" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Officers & Board
        </button>
        <button
          onClick={() => setActiveSection("admin-config")}
          className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${activeSection === "admin-config" ? "border-maroon text-maroon" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Admin Access
        </button>
      </div>

      {activeSection === "users" && (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Name</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Email</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Role</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[0.55rem] text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4"><span className="font-medium text-gray-900">{u.name}</span></td>
                    <td className="px-6 py-4 text-xs text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-maroon/10 text-maroon text-[0.55rem] font-bold uppercase tracking-widest rounded-sm">Admin</span>
                      ) : (
                        <span className="text-xs capitalize text-gray-600">{u.role || "member"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">No users registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {activeSection === "officers" && (
        <div className="space-y-4">
          {officers.map((year, yi) => (
            <div key={year.year}>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">{year.year}</h3>
              <div className="space-y-3">
                {year.members.map((member, mi) => (
                  <div key={mi} className="bg-white rounded-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Name</label>
                          <input value={member.name} onChange={(e) => updateOfficer(yi, mi, "name", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Role</label>
                          <input value={member.role} onChange={(e) => updateOfficer(yi, mi, "role", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div>
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Photo</label>
                          <input value={member.imageFileName} onChange={(e) => updateOfficer(yi, mi, "imageFileName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[0.55rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Bio</label>
                          <textarea value={member.bio} onChange={(e) => updateOfficer(yi, mi, "bio", e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 resize-y" />
                        </div>
                      </div>
                      <button onClick={() => deleteOfficer(yi, mi)} className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-colors shrink-0">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={addOfficer} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-gray-200 transition-colors">
              <Plus className="size-3.5" /> Add Officer
            </button>
            <button onClick={saveOfficers} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-maroon text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-maroon/90 transition-all disabled:opacity-50">
              <Save className="size-3.5" /> {saving ? "Saving..." : "Save Officers"}
            </button>
          </div>
        </div>
      )}

      {activeSection === "admin-config" && (
        <div className="max-w-2xl">
          <p className="text-sm text-gray-500 mb-4">One email per line. Users with these emails get admin dashboard access.</p>
          <textarea
            value={adminEmails}
            onChange={(e) => setAdminEmails(e.target.value)}
            rows={6}
            className="w-full font-mono text-sm p-4 border border-gray-200 rounded-sm focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 resize-y"
            placeholder="admin@example.com&#10;other@example.com"
          />
          <button onClick={saveAdminConfig} disabled={saving} className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-maroon text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-maroon/90 transition-all disabled:opacity-50">
            <Save className="size-3.5" /> {saving ? "Saving..." : "Save Admin List"}
          </button>
        </div>
      )}
    </div>
  );
}
