import React, { useEffect, useState } from "react";
import logoUrl from "../../../assets/logo.jpeg";

export default function Page() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract order ID from URL
  const orderId = typeof window !== "undefined"
    ? window.location.pathname.split("/").pop()
    : "";

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading receipt...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Receipt Not Found</h1>
          <p className="text-gray-500">{error}</p>
          <a href="/merchandise" className="inline-block px-6 py-3 bg-maroon text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-maroon-dark transition-all">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const items = order?.items || [];
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl border border-gray-200 rounded-sm print:shadow-none print:border-none">
        
        {/* Print Button (hidden when printing) */}
        <div className="print:hidden p-6 border-b border-gray-100 flex justify-between items-center">
          <a href="/merchandise" className="text-sm text-gray-500 hover:text-maroon transition-colors">&larr; Back to Merchandise</a>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-maroon text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-maroon-dark transition-all shadow-sm"
          >
            Print Receipt
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-maroon">
                  <img src={logoUrl} alt="JMPLS" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="font-serif font-bold text-xl text-gray-900">JMPLS</h1>
                  <p className="text-[0.6rem] uppercase tracking-widest text-gray-400 font-bold">UT Dallas</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Receipt</h2>
              <p className="text-sm text-gray-500 mt-1">{orderDate}</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
              <p className="font-mono text-gray-900 text-xs break-all">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[0.6rem] font-bold uppercase tracking-widest">
                {order.status === "paid" ? "Paid" : order.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Item</th>
                  <th className="text-center py-3 text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Qty</th>
                  <th className="text-right py-3 text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Price</th>
                  <th className="text-right py-3 text-[0.6rem] font-bold uppercase tracking-widest text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-4 text-gray-900 font-medium">{item.name}</td>
                    <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-600">${Number(item.price).toFixed(2)}</td>
                    <td className="py-4 text-right text-gray-900 font-bold">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.stripePaymentId && (
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
              <p>Payment processed securely via Stripe</p>
              <p className="font-mono mt-1">Transaction: {order.stripePaymentId}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-[0.6rem] uppercase tracking-widest text-gray-400 font-bold">
              John Marshall Pre-Law Society at the University of Texas at Dallas
            </p>
            <p className="text-[0.55rem] text-gray-300 mt-2">
              Thank you for supporting our mission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
