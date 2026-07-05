'use client';

import { useState } from 'react';
import { Settings, Shield, Globe, Terminal, Copy, Check, Play, RefreshCw, Layers } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    provider: 'DIALOG',
    package: 'DIALOG ZOOM',
    appType: 'netmod',
    customSni: '',
    v2boxDeviceId: ''
  });

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateConfig = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/create-v2ray', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch configuration');
      }
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1c1c] text-white">
      {/* Fluent Pseudo-Titlebar */}
      <header className="h-12 border-b border-white/5 bg-[#202020] flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#60cdff]" />
          <span className="text-xs text-white/80 font-semibold tracking-wide">Zentry Config Manager</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all cursor-pointer" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex max-w-5xl w-full mx-auto p-6 gap-6 overflow-hidden">
        {/* Settings Form Panel */}
        <section className="flex-1 flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight">V2Ray Configuration</h1>
            <p className="text-xs text-white/50">Configure your Dialog Tunnel package endpoints.</p>
          </div>

          {/* Group 1: Connection Profiles */}
          <div className="bg-[#2d2d2d]/60 border border-white/10 rounded-lg p-4 flex flex-col gap-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 text-white/90 border-b border-white/5 pb-2">
              <Globe className="w-4 h-4 text-white/60" />
              <h2 className="text-sm font-semibold">Network Settings</h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Provider</label>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/15 rounded px-3 py-1.5 text-sm focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-all cursor-pointer"
              >
                <option value="DIALOG">DIALOG</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Package Profile</label>
              <select
                name="package"
                value={formData.package}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/15 rounded px-3 py-1.5 text-sm focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-all cursor-pointer"
              >
                <option value="DIALOG ZOOM">DIALOG ZOOM</option>
                <option value="DIALOG YT">DIALOG YT</option>
                <option value="DIALOG Free">DIALOG Free</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">App Tunnel Type</label>
              <select
                name="appType"
                value={formData.appType}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/15 rounded px-3 py-1.5 text-sm focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-all cursor-pointer"
              >
                <option value="netmod">netmod</option>
                <option value="v2box">v2box</option>
                <option value="v2rayN">v2rayN</option>
              </select>
            </div>
          </div>

          {/* Group 2: Client Credentials */}
          <div className="bg-[#2d2d2d]/60 border border-white/10 rounded-lg p-4 flex flex-col gap-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 text-white/90 border-b border-white/5 pb-2">
              <Layers className="w-4 h-4 text-white/60" />
              <h2 className="text-sm font-semibold">Advanced Options</h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Custom SNI (Optional)</label>
              <input
                type="text"
                name="customSni"
                placeholder="e.g. m.zoom.us"
                value={formData.customSni}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/15 rounded px-3 py-1.5 text-sm placeholder:text-white/30 focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Device ID (Optional)</label>
              <input
                type="text"
                name="v2boxDeviceId"
                placeholder="e.g. UUID/Machine ID"
                value={formData.v2boxDeviceId}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/15 rounded px-3 py-1.5 text-sm placeholder:text-white/30 focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Fluent Accent Action Button */}
          <button
            onClick={generateConfig}
            disabled={loading}
            className="mt-2 w-full h-9 bg-[#60cdff] hover:bg-[#52afda] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100 text-[#121212] font-semibold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Generate Configuration
              </>
            )}
          </button>
        </section>

        {/* Results Window Panel */}
        <section className="flex-1 bg-[#272727]/40 border border-white/10 rounded-xl p-5 flex flex-col shadow-inner backdrop-blur-lg">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-white/90">
              <Terminal className="w-4 h-4 text-[#60cdff]" />
              <h2 className="text-sm font-semibold">Output Feed</h2>
            </div>
            {response && (
              <button
                onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white bg-white/5 px-2 py-1 rounded border border-white/10 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center overflow-auto rounded-lg bg-[#141414] border border-white/5 p-4 text-xs font-mono">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-2 text-white/40">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Contacting back.vpn.zentrycloud.tech...</span>
              </div>
            )}

            {!loading && !response && !error && (
              <div className="text-center text-white/40">
                No session initialized. Press "Generate Configuration" to send payload.
              </div>
            )}

            {error && (
              <div className="text-red-400 max-h-full overflow-y-auto whitespace-pre-wrap">
                Error Occurred: {error}
              </div>
            )}

            {!loading && response && (
              <pre className="text-green-400/90 max-h-full overflow-y-auto whitespace-pre-wrap select-text leading-relaxed">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}