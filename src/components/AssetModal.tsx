import React from 'react';
import { Asset } from '../types';

interface AssetModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetModal({ asset, onClose }: AssetModalProps) {
  // Mock data for the spreadsheet
  const spreadsheetData = [
    { influencer: "TechVibe Sarah", tier: "Mega", followers: "1.2M", cost: "$4,500", platform: "YouTube", status: "Negotiating" },
    { influencer: "Minimalist Maker", tier: "Mid-Tier", followers: "450K", cost: "$2,200", platform: "Instagram", status: "Approved" },
    { influencer: "Design Digest", tier: "Macro", followers: "850K", cost: "$3,800", platform: "Instagram", status: "Pending approval" },
    { influencer: "Code & Craft", tier: "Micro", followers: "95K", cost: "$900", platform: "TikTok", status: "Approved" },
    { influencer: "Workspace Vibe", tier: "Micro", followers: "120K", cost: "$1,100", platform: "Pinterest", status: "Approved" },
  ];

  // Mock data for the budget chart
  const chartData = [
    { label: "Q1 Actual", spent: 45000, color: "bg-primary" },
    { label: "Q2 Actual", spent: 58000, color: "bg-primary" },
    { label: "Q3 Original", spent: 75000, color: "bg-primary-container" },
    { label: "Shift Proposal", spent: 87000, color: "bg-gradient-to-t from-primary to-secondary" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">
              {asset.type === 'pdf' ? 'description' : 'table_chart'}
            </span>
            <div>
              <h3 className="font-display font-semibold text-lg text-on-surface">{asset.name}</h3>
              <p className="text-xs text-on-surface-variant font-sans">{asset.description || 'Referenced Project Asset'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar font-sans space-y-6">
          {asset.type === 'pdf' ? (
            <div className="space-y-6">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-outline mb-2">Asset Details</h4>
                <p className="text-sm text-on-surface leading-relaxed">
                  This document highlights the proposed reallocation of $12,000 from general search/social channels into active influencer partnerships. The projection model indicates a 34% increase in click-through rates (CTR) and higher brand authority for the November Zenith campaign.
                </p>
              </div>

              {/* Pure SVG & CSS Budget Projection Chart */}
              <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
                <h4 className="text-sm font-semibold text-on-surface mb-6">Marketing Campaign Spend & Proposal Projections ($)</h4>
                
                <div className="grid grid-cols-4 gap-4 items-end h-64 border-b border-l border-outline-variant/30 pb-4 px-4">
                  {chartData.map((item, index) => {
                    // Normalize height for visualization
                    const maxSpent = 100000;
                    const heightPercent = `${Math.min((item.spent / maxSpent) * 100, 100)}%`;

                    return (
                      <div key={index} className="flex flex-col items-center h-full justify-end group">
                        <div className="text-xs font-mono font-bold text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          ${item.spent.toLocaleString()}
                        </div>
                        <div 
                          style={{ height: heightPercent }} 
                          className={`w-full max-w-[50px] ${item.color} rounded-t-lg shadow-sm hover:brightness-110 transition-all duration-500`}
                        ></div>
                        <span className="text-[11px] font-medium text-on-surface-variant mt-2 text-center truncate w-full">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between items-center mt-4 text-[11px] text-outline px-2">
                  <span>* Financial Projection Model v2.4</span>
                  <span className="text-error font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                    +$12,000 Shifted
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-outline mb-2">Spreadsheet Overview</h4>
                <p className="text-sm text-on-surface">
                  Live spreadsheet listing shortlisted influencers for the Project Zenith November launching sequence. Includes negotiated sponsorship costs, platform allocations, and approval statuses.
                </p>
              </div>

              {/* Spreadsheet Grid */}
              <div className="border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-outline-variant/30 font-display text-on-surface-variant font-semibold">
                      <th className="p-3">Influencer</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Followers</th>
                      <th className="p-3">Cost (Sponsorship)</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spreadsheetData.map((row, i) => (
                      <tr 
                        key={i} 
                        className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors ${
                          i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/20'
                        }`}
                      >
                        <td className="p-3 font-semibold text-on-surface">{row.influencer}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            row.tier === 'Mega' ? 'bg-error-container text-on-error-container' :
                            row.tier === 'Macro' ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed'
                          }`}>
                            {row.tier}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-on-surface-variant">{row.followers}</td>
                        <td className="p-3 font-semibold font-mono text-primary">{row.cost}</td>
                        <td className="p-3 text-on-surface-variant">{row.platform}</td>
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              row.status === 'Approved' ? 'bg-emerald-500' :
                              row.status === 'Pending approval' ? 'bg-amber-500' : 'bg-outline animate-pulse'
                            }`}></span>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between text-[11px] text-outline font-mono pt-2">
                <span>5 Rows • 6 Columns</span>
                <span className="text-primary font-semibold">Total Allocated Cost: $12,500</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-outline-variant/15 flex justify-end gap-3 bg-surface-container-low rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-on-primary font-display font-medium text-xs rounded-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
