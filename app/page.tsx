'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    provider: 'DIALOG',
    package: 'DIALOG ZOOM',
    appType: 'netmod',
    customSni: '',
    v2boxDeviceId: ''
  });

  const [response, setResponse] = useState<{
    success: boolean;
    config?: string;
    expiry?: string;
    clientEmail?: string;
    clientId?: string;
    sni?: string;
    appType?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isLowMemory, setIsLowMemory] = useState(false);

  // Detect low-end hardware on mount to apply rendering optimizations
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const memory = (navigator as any).deviceMemory;
      if (memory && memory <= 4) {
        setIsLowMemory(true);
      }
    }
  }, []);

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
        headers: { 'Content-Type': 'application/json' },
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
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1c1c] text-[#f3f3f3]">
      
      {/* Titlebar (Optimized, no complex structures) */}
      <header className="h-12 border-b border-white/5 bg-[#202020] flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          {/* Shield Icon SVG */}
          <svg className="w-4 h-4 text-[#60cdff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs text-white/80 font-semibold tracking-wide">Zentry Config Manager</span>
        </div>
        <div className="flex gap-1.5 opacity-40">
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Settings Column */}
        <section className="md:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1 mb-1">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">V2Ray Configuration</h1>
            <p className="text-xs text-white/50">Modify options and retrieve your tunnel configurations.</p>
          </div>

          {/* Form Card (Solid background for performance) */}
          <div className="bg-[#262626] border border-white/10 rounded-lg p-4 flex flex-col gap-4 shadow-md">
            <div className="flex items-center gap-2 text-white/90 border-b border-white/5 pb-2">
              <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <h2 className="text-sm font-semibold">Profile Options</h2>
            </div>

            {/* Inputs - Touch friendly layout */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Provider</label>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/10 hover:border-white/25 rounded px-3 py-2 text-sm focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-colors cursor-pointer text-white h-10"
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
                className="bg-[#2d2d2d] border border-white/10 hover:border-white/25 rounded px-3 py-2 text-sm focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-colors cursor-pointer text-white h-10"
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
                className="bg-[#2d2d2d] border border-white/10 hover:border-white/25 rounded px-3 py-2 text-sm focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-colors cursor-pointer text-white h-10"
              >
                <option value="netmod">netmod</option>
                <option value="v2box">v2box</option>
                <option value="v2rayN">v2rayN</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Custom SNI (Optional)</label>
              <input
                type="text"
                name="customSni"
                placeholder="e.g. m.zoom.us"
                value={formData.customSni}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/10 hover:border-white/25 rounded px-3 py-2 text-sm placeholder:text-white/20 focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-colors text-white h-10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/70">Device ID (Optional)</label>
              <input
                type="text"
                name="v2boxDeviceId"
                placeholder="e.g. UUID"
                value={formData.v2boxDeviceId}
                onChange={handleInputChange}
                className="bg-[#2d2d2d] border border-white/10 hover:border-white/25 rounded px-3 py-2 text-sm placeholder:text-white/20 focus:border-b-2 focus:border-b-[#60cdff] focus:outline-none transition-colors text-white h-10"
              />
            </div>
          </div>

          <button
            onClick={generateConfig}
            disabled={loading}
            className="w-full h-11 bg-[#60cdff] hover:bg-[#51bde9] active:bg-[#40aedb] disabled:opacity-50 text-[#121212] font-semibold text-sm rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
                Generate Link
              </>
            )}
          </button>
        </section>

        {/* Output Column */}
        <section className="md:col-span-7 flex flex-col gap-4">
          
          {/* Active Error Output */}
          {error && (
            <div className="bg-[#442727] border border-red-500/30 text-red-200 rounded-lg p-4 text-xs font-mono leading-relaxed">
              <strong>Process Error:</strong> {error}
            </div>
          )}

          {/* Prompt/Idle State */}
          {!loading && !response && !error && (
            <div className="bg-[#222222] border border-white/5 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <svg className="w-10 h-10 text-white/25 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <h3 className="text-sm font-semibold text-white/70">Console Output Waiting</h3>
              <p className="text-xs text-white/40 max-w-xs mt-1">Ready to capture generated configurations. Click the run button to begin.</p>
            </div>
          )}

          {/* Loading Display */}
          {loading && (
            <div className="bg-[#222222] border border-white/5 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <svg className="w-10 h-10 text-[#60cdff] animate-spin mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" stroke="white" strokeWidth="1.5" className="opacity-15"/>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              <span className="text-xs text-white/60 font-medium">Bypassing constraints, securing Tunnel payload...</span>
            </div>
          )}

          {/* Refactored Success Display */}
          {!loading && response && response.config && (
            <div className="flex flex-col gap-4">
              
              {/* Primary Config Actions Panel */}
              <div className="bg-[#262626] border border-white/15 rounded-lg p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-400">Payload Ready</span>
                  </div>
                  {response.expiry && (
                    <span className="text-[11px] text-white/45 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      Expires: {response.expiry}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {/* Highly-visible, non-editable text container */}
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={3}
                      value={response.config}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      className="w-full bg-[#1b1b1b] border border-white/10 rounded p-3 text-xs font-mono text-[#60cdff] focus:outline-none focus:border-[#60cdff] select-all leading-relaxed resize-none cursor-pointer"
                    />
                    <div className="absolute right-2 bottom-2 text-[10px] text-white/30 pointer-events-none">
                      Tap to select all
                    </div>
                  </div>

                  {/* Primary Call-to-Action Copy Button */}
                  <button
                    onClick={() => copyToClipboard(response.config || '')}
                    className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-[#60cdff] text-black hover:bg-[#52badb] active:opacity-90'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        COPIED TO CLIPBOARD
                      </>
                    ) : (
                      <>
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        COPY V2RAY CONFIG
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Metadata Details Pane */}
              <div className="bg-[#262626]/40 border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowMetadata(!showMetadata)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs text-white/50 hover:text-white transition-colors hover:bg-white/5"
                >
                  <span className="font-semibold">Technical Profile Information</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${showMetadata ? 'rotate-180' : ''}`} 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showMetadata && (
                  <div className={`p-4 border-t border-white/5 bg-[#1f1f1f]/50 text-xs font-mono flex flex-col gap-2.5 leading-relaxed ${isLowMemory ? '' : 'transition-all'}`}>
                    <div className="flex flex-col md:flex-row md:justify-between py-1 border-b border-white/5 gap-0.5">
                      <span className="text-white/40">Email ID:</span>
                      <span className="text-white/80 break-all select-all">{response.clientEmail || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between py-1 border-b border-white/5 gap-0.5">
                      <span className="text-white/40">Client UUID:</span>
                      <span className="text-white/80 break-all select-all">{response.clientId || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between py-1 border-b border-white/5 gap-0.5">
                      <span className="text-white/40">SNI Domain:</span>
                      <span className="text-white/80 break-all select-all">{response.sni || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between py-1 gap-0.5">
                      <span className="text-white/40">Target Client:</span>
                      <span className="text-white/80 uppercase">{response.appType || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </section>
      </main>
    </div>
  );
}
