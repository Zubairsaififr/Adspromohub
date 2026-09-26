import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

const RAW_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_URL = RAW_API_URL.replace(/\/+$/, "");

interface CreatedTestUser {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  customer_id: string;
  referral_id: string;
  referred_by: string;
  password: string;
}

export default function DevSignup() {
  const navigate = useNavigate();
  const [sponsorReferralId, setSponsorReferralId] = useState("");
  const [count, setCount] = useState(10);
  const [createdUsers, setCreatedUsers] = useState<CreatedTestUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setSuccess("Copied to clipboard.");
      window.setTimeout(() => setSuccess(""), 1500);
    } catch {
      setError("Unable to copy.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const sponsor = sponsorReferralId.trim().toUpperCase().replace(/[-\s]/g, "");

    if (!sponsor) {
      setError("Please enter Sponsor Referral ID.");
      return;
    }

    if (count < 1 || count > 10) {
      setError("You can create between 1 and 10 users at once.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setCreatedUsers([]);

      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/signin", { replace: true });
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/dev-signup/create-users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sponsor_referral_id: sponsor,
            count,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to create test users.");
      }

      setCreatedUsers(Array.isArray(data?.users) ? data.users : []);
      setSuccess(data?.message || `${count} test user(s) created successfully.`);
    } catch (err: any) {
      console.error("Dev signup error:", err);
      setError(err?.message || "Unable to create test users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-black" />
      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </button>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Dev Signup</h1>
                <p className="mt-1 text-sm text-white/40">
                  Create direct test referrals for APH testing
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-xs text-purple-300">
            <ShieldCheck className="h-4 w-4" />
            Admin Only
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold">Create Test Users</h2>
            <p className="mb-6 mt-1 text-xs leading-5 text-white/40">
              Generated users become direct referrals of this sponsor.
            </p>

            <label className="mb-2 block text-xs font-medium text-white/60">
              Sponsor Referral ID
            </label>
            <input
              value={sponsorReferralId}
              onChange={(e) => setSponsorReferralId(e.target.value)}
              placeholder="APH12345678"
              autoComplete="off"
              className="mb-5 w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm uppercase text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
            />

            <label className="mb-2 block text-xs font-medium text-white/60">
              Number of Users
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mb-5 w-full cursor-pointer rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                <option key={value} value={value}>
                  {value} User{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <div className="mb-5 rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/45">
              <div>Email: testuser1@gmail.com, testuser2@gmail.com...</div>
              <div>Password: 123456789</div>
              <div>Country: India</div>
              <div>Account: Active</div>
              <div>Package: Not activated automatically</div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create {count} Test User{count > 1 ? "s" : ""}
                </>
              )}
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-300" />
                  <h2 className="font-semibold">Created Accounts</h2>
                </div>
                <p className="mt-1 text-xs text-white/40">Latest generated batch</p>
              </div>
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                {createdUsers.length}
              </span>
            </div>

            {createdUsers.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
                <Users className="mb-3 h-9 w-9 text-white/15" />
                <p className="text-sm text-white/40">No test users created yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-white/40">
                      <th className="px-4 py-4">S.N</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Email</th>
                      <th className="px-4 py-4">Password</th>
                      <th className="px-4 py-4">Customer ID</th>
                      <th className="px-4 py-4">Referral ID</th>
                      <th className="px-4 py-4">Sponsor</th>
                      <th className="px-4 py-4">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdUsers.map((user, index) => (
                      <tr key={user.id} className="border-b border-white/5 text-sm">
                        <td className="px-4 py-4 text-white/40">{index + 1}</td>
                        <td className="px-4 py-4 font-medium">{user.full_name}</td>
                        <td className="px-4 py-4">
                          <button type="button" onClick={() => copyText(user.email)} className="flex cursor-pointer items-center gap-2 text-white/60 hover:text-purple-300">
                            {user.email}<Copy className="h-3 w-3" />
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <button type="button" onClick={() => copyText(user.password)} className="flex cursor-pointer items-center gap-2 text-white/60 hover:text-purple-300">
                            {user.password}<Copy className="h-3 w-3" />
                          </button>
                        </td>
                        <td className="px-4 py-4 text-purple-300">{user.customer_id}</td>
                        <td className="px-4 py-4 text-purple-300">{user.referral_id}</td>
                        <td className="px-4 py-4 text-blue-300">{user.referred_by}</td>
                        <td className="px-4 py-4 text-white/50">{user.phone_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
