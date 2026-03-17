"use client";

import { useState } from "react";
import axios from "axios";

const API_BASE = "https://urlbackend.navyasinha.xyz";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Analytics
  const [analyticsInput, setAnalyticsInput] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const res = await axios.post(`${API_BASE}/url`, { url: url.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const link = result.shortURL || `${API_BASE}/url/${result.shortId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalytics = async (e) => {
    e.preventDefault();
    if (!analyticsInput.trim()) return;
    setAnalyticsLoading(true);
    setAnalyticsError("");
    setAnalytics(null);

    let shortId = analyticsInput.trim();
    // extract from full URL
    if (shortId.includes("/")) {
      shortId = shortId.split("/").pop();
    }

    try {
      const res = await axios.get(`${API_BASE}/url/analytics/${shortId}`);
      setAnalytics({ ...res.data, shortId });
    } catch (err) {
      setAnalyticsError(err.response?.data?.message || "Could not find that link.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <main className="min-h-screen font-[family-name:var(--font-sans)] px-4 py-10 md:py-20">

      <div className="max-w-3xl mx-auto text-center mb-16">


        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight">
          Snip<span className="text-[#ff5722]">.</span>it
        </h1>
        <p className="text-lg md:text-xl text-black/70 mt-4 max-w-xl mx-auto font-medium">
          Paste your long URL, get a short one. It&apos;s that simple.
        </p>
      </div>


      <section className="max-w-2xl mx-auto mb-12">
        <div className="bg-[#a6faff] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
            <span className="inline-block bg-black text-white w-8 h-8 rounded-full text-center leading-8 text-sm font-bold">1</span>
            Shorten a URL
          </h2>

          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="https://my-super-long-url.com/abc..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 text-lg border-[3px] border-black bg-white font-medium placeholder:text-black/30 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ff5722] text-white font-bold text-lg px-8 py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                  Snipping…
                </span>
              ) : "Snip it"}
            </button>
          </form>

          {error && (
            <div className="mt-5 bg-[#ff4444] text-white font-bold px-5 py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          )}


          {result && (
            <div className="mt-6 bg-[#b8ff57] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
              <p className="text-sm font-bold uppercase text-black/60 mb-1">Your shortened link</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={result.shortURL || `${API_BASE}/url/${result.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border-[3px] border-black px-4 py-3 text-lg font-bold font-[family-name:var(--font-mono)] text-black hover:bg-[#fbbf24] transition-colors break-all"
                >
                  {result.shortURL || `${API_BASE}/url/${result.shortId}`}
                </a>
                <button
                  onClick={handleCopy}
                  className="bg-white font-bold px-5 py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer text-nowrap"
                >
                  {copied ? "Copied!" : " Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-2xl mx-auto mb-16">
        <div className="bg-[#ffa6f6] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
            <span className="inline-block bg-black text-white w-8 h-8 rounded-full text-center leading-8 text-sm font-bold">2</span>
            Track Clicks
          </h2>

          <form onSubmit={handleAnalytics} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Paste short ID or full short URL…"
              value={analyticsInput}
              onChange={(e) => setAnalyticsInput(e.target.value)}
              className="flex-1 px-4 py-3 text-lg border-[3px] border-black bg-white font-medium placeholder:text-black/30 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
            />
            <button
              type="submit"
              disabled={analyticsLoading}
              className="bg-[#fbbf24] text-black font-bold text-lg px-8 py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {analyticsLoading ? "Loading…" : "Track "}
            </button>
          </form>

          {analyticsError && (
            <div className="mt-5 bg-[#ff4444] text-white font-bold px-5 py-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {analyticsError}
            </div>
          )}

          {analytics && (
            <div className="mt-6 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">

              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                <div className="flex-1 bg-[#a6faff] border-[3px] border-black p-4 text-center">
                  <p className="text-sm font-bold uppercase text-black/60">Total Clicks</p>
                  <p className="text-5xl font-bold text-black font-[family-name:var(--font-mono)] mt-1">{analytics.totalClicks}</p>
                </div>
                <div className="flex-1 bg-[#b8ff57] border-[3px] border-black p-4 text-center">
                  <p className="text-sm font-bold uppercase text-black/60">Short ID</p>
                  <p className="text-2xl font-bold text-black font-[family-name:var(--font-mono)] mt-2">{analytics.shortId}</p>
                </div>
              </div>


              {analytics.analytics && analytics.analytics.length > 0 ? (
                <div>
                  <h3 className="font-bold text-sm uppercase text-black/60 mb-3">Recent Visits</h3>
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {[...analytics.analytics].reverse().map((visit, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-100 border-2 border-black px-4 py-2 font-[family-name:var(--font-mono)] text-sm"
                      >
                        <span className="font-bold">#{analytics.totalClicks - idx}</span>
                        <span className="text-black/60">{new Date(visit.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center font-bold text-black/40 py-4">No clicks yet — share your link!</p>
              )}
            </div>
          )}
        </div>
      </section>


      <footer className="max-w-2xl mx-auto text-center">

        <span className="text-[#ff5722]">♥</span> Navya Sinha

      </footer>
    </main>
  );
}
