'use client';

import React, { useState } from 'react';
import { StartupCostItem, ClassificationType } from '@/types/business';
import { ClassificationBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/calculations/financialEngine';
import { Plus, Trash2, Edit2, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface StartupCostEditorProps {
  startupCosts: StartupCostItem[];
  userBudget: number;
  onUpdateCosts: (updated: StartupCostItem[]) => void;
}

const CATEGORIES: StartupCostItem['category'][] = [
  'Equipment & Machinery',
  'Premises & Deposit',
  'Licenses & Compliance',
  'Raw Materials & Inventory',
  'Branding & Packaging',
  'Marketing & Launch',
  'Staff Recruitment & Training',
  'Technology & POS',
  'Working Capital Reserve',
  'Transportation & Logistics',
  'Contingency / Miscellaneous'
];

export function StartupCostEditor({
  startupCosts,
  userBudget,
  onUpdateCosts
}: StartupCostEditorProps) {
  const [costs, setCosts] = useState<StartupCostItem[]>(startupCosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // New item modal/inline form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState(25000);
  const [newItemCategory, setNewItemCategory] = useState<StartupCostItem['category']>('Equipment & Machinery');

  const total = costs.reduce((s, i) => s + i.amount, 0);
  const diff = userBudget - total;
  const isOverBudget = diff < 0;

  const handleAmountChange = (id: string, newAmt: number) => {
    const updated = costs.map(item => item.id === id ? { ...item, amount: Math.max(0, newAmt), classification: 'USER INPUT' as ClassificationType } : item);
    setCosts(updated);
    onUpdateCosts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = costs.filter(item => item.id !== id);
    setCosts(updated);
    onUpdateCosts(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: StartupCostItem = {
      id: 'sc-custom-' + Date.now(),
      category: newItemCategory,
      name: newItemName.trim(),
      amount: newItemAmount,
      isEditable: true,
      classification: 'USER INPUT'
    };

    const updated = [...costs, newItem];
    setCosts(updated);
    onUpdateCosts(updated);
    setNewItemName('');
    setNewItemAmount(25000);
    setShowAddForm(false);
  };

  const filteredCosts = filterCategory === 'All'
    ? costs
    : costs.filter(c => c.category === filterCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>Startup Capital Expenditure (CapEx & Initial Reserves)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every line item can be edited or customized. Changes automatically recalculate working capital runway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Budget Comparison Banner */}
      <div className={`mb-4 p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        isOverBudget 
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200' 
          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          <AlertCircle className={`w-4 h-4 shrink-0 ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`} />
          <span>
            User Budget: <strong>{formatINR(userBudget)}</strong> | Total Setup Costs: <strong>{formatINR(total)}</strong>
          </span>
        </div>
        <div>
          {isOverBudget ? (
            <span className="font-bold text-rose-700 dark:text-rose-400">
              Budget Shortfall: {formatINR(Math.abs(diff))} (Need cost cutting or additional funding)
            </span>
          ) : (
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              Unallocated Buffer: {formatINR(diff)} available for working capital
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 text-xs">
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            filterCategory === 'All'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All Items ({costs.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = costs.filter(c => c.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="p-4 mb-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
          <div className="font-bold text-slate-900 dark:text-white mb-2">Add Custom Cost Item</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1">Item Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Commercial Delivery Scooter"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 mb-1">Estimated Cost (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shrink-0"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
              <th className="py-2.5 px-3 font-semibold">Cost Item & Specification</th>
              <th className="py-2.5 px-3 font-semibold">Category</th>
              <th className="py-2.5 px-3 font-semibold">Classification</th>
              <th className="py-2.5 px-3 font-semibold text-right">Amount (₹)</th>
              <th className="py-2.5 px-3 font-semibold text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCosts.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </div>
                  {item.sourceNote && (
                    <div className="text-[11px] text-slate-400 mt-0.5 max-w-md">
                      {item.sourceNote}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {item.category}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <ClassificationBadge type={item.classification} size="sm" />
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  {editingId === item.id ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <input
                        type="number"
                        className="w-24 px-2 py-1 text-right border border-emerald-500 rounded bg-white dark:bg-slate-800 font-bold"
                        defaultValue={item.amount}
                        autoFocus
                        onBlur={(e) => {
                          handleAmountChange(item.id, parseInt(e.target.value) || 0);
                          setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAmountChange(item.id, parseInt((e.target as any).value) || 0);
                            setEditingId(null);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 inline-flex items-center gap-1 group"
                      title="Click to edit value"
                    >
                      <span>{formatINR(item.amount)}</span>
                      <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </td>
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white">
              <td className="py-3 px-3" colSpan={3}>
                Total Initial Capital Expenditure & Reserves
              </td>
              <td className="py-3 px-3 text-right text-sm text-emerald-600 dark:text-emerald-400">
                {formatINR(total)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
