"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [balance, setBalance] = useState(10000.00);
  const [positions, setPositions] = useState([]);
  const [marketPrices, setMarketPrices] = useState({
    XAUUSD: { bid: 2342.50, ask: 2342.80, rsi: 54.2 },
    EURUSD: { bid: 1.0872, ask: 1.0874, rsi: 48.6 }
  });

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!token.trim()) {
      alert("Please enter a valid API token or login key.");
      return;
    }
    setIsLoggedIn(true);
    addLog("Successfully authenticated via Web API session.");
  };

  const startBot = () => {
    setIsTrading(true);
    addLog("Apex Web Bot activated. Scanning XAUUSD and EURUSD live feeds...");
  };

  const stopBot = () => {
    setIsTrading(false);
    addLog("Apex Web Bot paused by user.");
  };

  const executeManualTrade = (symbol, action) => {
    const price = action === 'BUY' ? marketPrices[symbol].ask : marketPrices[symbol].bid;
    const newPos = {
      id: Math.floor(Math.random() * 90000) + 10000,
      symbol,
      action,
      price,
      time: new Date().toLocaleTimeString()
    };
    setPositions(prev => [newPos, ...prev]);
    setBalance(prev => prev - 1.50); // small simulated spread/fee
    addLog(`EXECUTED ${action} on ${symbol} @ ${price}`);
  };

  const closePosition = (id) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    addLog(`Closed position #${id}`);
  };

  // Simulated live market fluctuations when trading is active
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices(prev => ({
        XAUUSD: {
          bid: +(prev.XAUUSD.bid + (Math.random() - 0.49) * 0.4).toFixed(2),
          ask: +(prev.XAUUSD.ask + (Math.random() - 0.49) * 0.4).toFixed(2),
          rsi: +(Math.min(85, Math.max(15, prev.XAUUSD.rsi + (Math.random() - 0.5) * 3))).toFixed(1)
        },
        EURUSD: {
          bid: +(prev.EURUSD.bid + (Math.random() - 0.5) * 0.0002).toFixed(4),
          ask: +(prev.EURUSD.ask + (Math.random() - 0.5) * 0.0002).toFixed(4),
          rsi: +(Math.min(85, Math.max(15, prev.EURUSD.rsi + (Math.random() - 0.5) * 3))).toFixed(1)
        }
      }));

      if (isTrading) {
        // Random algorithmic trigger simulation
        if (Math.random() < 0.15 && positions.length < 3) {
          const sym = Math.random() > 0.5 ? 'XAUUSD' : 'EURUSD';
          const act = Math.random() > 0.5 ? 'BUY' : 'SELL';
          executeManualTrade(sym, act);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isTrading, positions]);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">ApexWeb <span className="text-amber-400">Trader</span></h1>
            <p className="text-xs text-slate-400">Cloud-Native Vercel Trading Client (No MT5 Required)</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">API Token / Session Key</label>
              <input 
                type="password" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your broker API token..." 
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-amber-500/20">
              Connect &amp; Launch Dashboard
            </button>
          </form>
          <p className="text-[11px] text-slate-500 text-center">Runs independently on Vercel cloud infrastructure. Secure and lightweight.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navbar */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">AP</div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              ApexWeb Trader 
              <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full ${isTrading ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                {isTrading ? 'Bot Active' : 'Standby'}
              </span>
            </h1>
            <p className="text-xs text-slate-400">Connected via Cloud Web API</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isTrading ? (
            <button onClick={startBot} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-emerald-500/20">
              Start Cloud Bot
            </button>
          ) : (
            <button onClick={stopBot} className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-rose-500/20">
              Pause Bot
            </button>
          )}
          <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm border border-slate-700 transition">
            Disconnect
          </button>
        </div>
      </header>

      {/* Account Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-400">Account Balance</p>
          <h2 className="text-2xl font-bold text-white mt-1">${balance.toFixed(2)}</h2>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-400">Active Positions</p>
          <h2 className="text-2xl font-bold text-amber-400 mt-1">{positions.length} Trades</h2>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-slate-400">Execution Mode</p>
          <h2 className="text-2xl font-bold text-emerald-400 mt-1">Vercel Serverless</h2>
        </div>
      </div>

      {/* Market Cards & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XAUUSD Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-400 text-lg">XAUUSD <span className="text-xs text-slate-400 font-normal">Gold Spot</span></span>
            <span className="px-2 py-1 text-xs rounded bg-slate-800 text-sky-400 font-mono">RSI: {marketPrices.XAUUSD.rsi}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800/60">
            <div><span className="text-slate-400 text-xs block">BID PRICE</span><span className="font-mono font-semibold text-white text-base">{marketPrices.XAUUSD.bid}</span></div>
            <div><span className="text-slate-400 text-xs block">ASK PRICE</span><span className="font-mono font-semibold text-white text-base">{marketPrices.XAUUSD.ask}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => executeManualTrade('XAUUSD', 'BUY')} className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition">
              BUY XAUUSD
            </button>
            <button onClick={() => executeManualTrade('XAUUSD', 'SELL')} className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold text-sm transition">
              SELL XAUUSD
            </button>
          </div>
        </div>

        {/* EURUSD Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sky-400 text-lg">EURUSD <span className="text-xs text-slate-400 font-normal">Euro / USD</span></span>
            <span className="px-2 py-1 text-xs rounded bg-slate-800 text-sky-400 font-mono">RSI: {marketPrices.EURUSD.rsi}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800/60">
            <div><span className="text-slate-400 text-xs block">BID PRICE</span><span className="font-mono font-semibold text-white text-base">{marketPrices.EURUSD.bid}</span></div>
            <div><span className="text-slate-400 text-xs block">ASK PRICE</span><span className="font-mono font-semibold text-white text-base">{marketPrices.EURUSD.ask}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => executeManualTrade('EURUSD', 'BUY')} className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition">
              BUY EURUSD
            </button>
            <button onClick={() => executeManualTrade('EURUSD', 'SELL')} className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-semibold text-sm transition">
              SELL EURUSD
            </button>
          </div>
        </div>
      </div>

      {/* Positions & Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Positions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Active Positions ({positions.length})</h3>
          <div className="h-44 overflow-y-auto space-y-2">
            {positions.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-10">No active trades currently open.</div>
            ) : (
              positions.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className={`font-bold ${p.action === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{p.action}</span> 
                    <span className="text-white font-semibold ml-2">{p.symbol}</span>
                    <span className="text-slate-400 ml-2">@ {p.price}</span>
                  </div>
                  <button onClick={() => closePosition(p.id)} className="px-3 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">
                    Close
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Execution Logs</h3>
          <div className="h-44 overflow-y-auto bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-800">
            {logs.map((l, idx) => (
              <div key={idx}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
