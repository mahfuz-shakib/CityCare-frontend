import { useMemo, useState } from "react";
import { Download, ReceiptText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Container from "../../../container/Container";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import SearchFilterPanel from "../../../components/SearchFilterPanel";
import Pagination from "../../../components/Pagination";
import PageHeader from "../../../components/PageHeader";

const getPurpose = (payment) => {
  const purpose = String(payment.purpose || "").toLowerCase();
  if (purpose.includes("boost") || payment.metadata?.issueId) return "Issue boost";
  if (purpose.includes("subscription") || payment.metadata?.userId) return "Premium subscription";
  return "Other";
};

const getStatus = (payment) => String(payment.paymentStatus || payment.status || "unknown").toLowerCase();
const getAmount = (payment) => Number(payment.amount ?? (payment.amount_total ? payment.amount_total / 100 : 0));
const getDate = (payment) => payment.createdAt || payment.created || null;

const downloadReceipt = (payment) => {
  const receipt = {
    transactionId: payment.sessionId || payment.session || payment.id || "unknown",
    date: getDate(payment),
    amount: getAmount(payment),
    currency: (payment.currency || "BDT").toUpperCase(),
    status: getStatus(payment),
    purpose: getPurpose(payment),
    issue: payment.metadata?.issueTitle || null,
  };
  const link = document.createElement("a");
  link.href = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(receipt, null, 2))}`;
  link.download = `citycare-payment-${receipt.transactionId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ purpose: "all", status: "all", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["payments", "history", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const response = await axiosSecure.get(`/payments?email=${encodeURIComponent(user.email)}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!user?.email,
  });

  const filteredPayments = useMemo(
    () =>
      payments
        .filter((payment) => {
          const purpose = getPurpose(payment).toLowerCase();
          const status = getStatus(payment);
          const search = filters.search.trim().toLowerCase();
          const matchesPurpose = filters.purpose === "all" || purpose.includes(filters.purpose);
          const matchesStatus = filters.status === "all" || status === filters.status;
          const searchable = [payment.customerEmail, payment.sessionId, payment.id, payment.metadata?.issueTitle]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return matchesPurpose && matchesStatus && (!search || searchable.includes(search));
        })
        .sort((a, b) => new Date(getDate(b) || 0) - new Date(getDate(a) || 0)),
    [payments, filters],
  );

  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const visiblePayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalSpent = payments.reduce((total, payment) => total + getAmount(payment), 0);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <Container>
      <title>Payment History</title>
      <div className="mx-auto max-w-6xl space-y-6 py-8">
        <PageHeader
          eyebrow="Citizen Finance"
          title="Payment History"
          description="View your issue boosts, premium subscriptions, and transaction records."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Transactions</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{payments.length}</p>
            <p className="mt-1 text-sm text-slate-500">Recorded payments</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total paid</p>
            <p className="mt-2 text-3xl font-bold text-primary">{totalSpent.toFixed(2)} BDT</p>
            <p className="mt-1 text-sm text-slate-500">Based on recorded transactions</p>
          </div>
        </div>
        <SearchFilterPanel
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          searchPlaceholder="Search transaction or issue"
          onFilterChange={updateFilter}
          filters={[
            {
              key: "purpose",
              value: filters.purpose,
              label: "All payment types",
              options: [
                { value: "all", text: "All payment types" },
                { value: "boost", text: "Issue boost" },
                { value: "subscription", text: "Premium subscription" },
                { value: "other", text: "Other" },
              ],
            },
            {
              key: "status",
              value: filters.status,
              label: "All statuses",
              options: [
                { value: "all", text: "All statuses" },
                { value: "paid", text: "Paid" },
                { value: "unpaid", text: "Unpaid" },
                { value: "pending", text: "Pending" },
              ],
            },
          ]}
        />
        <div className="table-shell">
          {isError ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-slate-700">Payment history could not be loaded.</p>
              <button type="button" onClick={() => refetch()} className="btn btn-sm mt-4 bg-primary text-white">
                Try again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500">
                        Loading payment history...
                      </td>
                    </tr>
                  ) : visiblePayments.length ? (
                    visiblePayments.map((payment) => (
                      <tr key={payment._id || payment.sessionId || payment.id}>
                        <td>{getDate(payment) ? new Date(getDate(payment)).toLocaleString() : "N/A"}</td>
                        <td className="font-semibold">
                          {getAmount(payment).toFixed(2)} {(payment.currency || "BDT").toUpperCase()}
                        </td>
                        <td>{getPurpose(payment)}</td>
                        <td className="capitalize">{getStatus(payment)}</td>
                        <td className="max-w-48 truncate font-mono text-xs">
                          {payment.sessionId || payment.id || "N/A"}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => downloadReceipt(payment)}
                            title="Download receipt"
                            className="btn btn-ghost btn-sm text-primary"
                          >
                            <Download size={15} />
                            <span className="sr-only">Download receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <ReceiptText className="mx-auto mb-2 text-slate-300" size={30} />
                        <p className="text-slate-500">No payment records found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPayments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Container>
  );
};

export default PaymentHistory;
