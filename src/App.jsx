import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const MEDIAN_HOUSE_PRICE = 1016700;

const ITEMS = [
  { id: 'coffee', name: 'Flat White', price: 5, emoji: '☕' },
  { id: 'avocado-toast', name: 'Avocado Toast', price: 15, emoji: '🥑' },
  { id: 'gym', name: 'Gym Membership (Monthly)', price: 65, emoji: '💪' },
  { id: 'iphone', name: 'iPhone 15 Pro Max', price: 2000, emoji: '📱' },
  { id: 'designer-bag', name: 'Designer Handbag', price: 5000, emoji: '👜' },
  { id: 'macbook', name: 'MacBook Pro', price: 3999, emoji: '💻' },
  { id: 'rolex', name: 'Rolex Watch', price: 15000, emoji: '⌚' },
  { id: 'diamond-ring', name: 'Diamond Ring', price: 10000, emoji: '💍' },
  { id: 'gold-bar', name: 'Gold Bar (1kg)', price: 200000, emoji: '🪙' },
  { id: 'tesla', name: 'Tesla Model 3', price: 60000, emoji: '🚗' },
  { id: 'holiday', name: 'European Holiday', price: 12000, emoji: '✈️' },
  { id: 'toyota', name: 'Toyota Corolla', price: 30000, emoji: '🚗' },
  { id: 'ps5', name: 'PlayStation 5', price: 800, emoji: '🎮' },
].toSorted((a, b) => a.price - b.price);

export default function HousingCrisisCalculator() {
  const [budget, setBudget] = useState(MEDIAN_HOUSE_PRICE);
  const [purchases, setPurchases] = useState({});
  const [copied, setCopied] = useState(false);

  const buyItem = (item) => {
    if (budget >= item.price) {
      setBudget(budget - item.price);
      setPurchases({
        ...purchases,
        [item.id]: (purchases[item.id] || 0) + 1
      });
    }
  };

  const sellItem = (item) => {
    if (purchases[item.id] && purchases[item.id] > 0) {
      setBudget(budget + item.price);
      const newPurchases = { ...purchases };
      newPurchases[item.id] -= 1;
      if (newPurchases[item.id] === 0) {
        delete newPurchases[item.id];
      }
      setPurchases(newPurchases);
    }
  };

  const getPurchasedItems = () => {
    return Object.entries(purchases)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const item = ITEMS.find(i => i.id === id);
        return `${item.emoji} ${item.name} x${count}`;
      });
  };

  const shareItems = () => {
    const purchasedItems = getPurchasedItems();
    if (purchasedItems.length === 0) {
      navigator.clipboard.writeText('I could buy a house... or nothing 💩\n\nSee what you could buy instead: https://muhashi.com/median-house-australia/');
    } else {
      const totalSpent = MEDIAN_HOUSE_PRICE - budget;
      const text = `Instead of buying a $${MEDIAN_HOUSE_PRICE.toLocaleString()} house in Australia, I bought:\n\n${purchasedItems.join('\n')}\n\nTotal spent: $${totalSpent.toLocaleString()}\n\nSee what you could buy instead: https://muhashi.com/median-house-australia/`;
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setBudget(MEDIAN_HOUSE_PRICE);
    setPurchases({});
  };

  const totalSpent = MEDIAN_HOUSE_PRICE - budget;
  const percentSpent = (totalSpent / MEDIAN_HOUSE_PRICE) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">
            The Median Australian House Costs <span className="font-bold text-red-600">${MEDIAN_HOUSE_PRICE.toLocaleString()}</span>
          </h1>
          <p className="text-xl text-gray-600">
            What could you buy instead?
          </p>
        </div>

        {/* Budget Display */}
        <div className="sticky top-0 bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Budget</h2>
              <p className="text-4xl font-bold text-green-600">
                ${budget.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Spent: ${totalSpent.toLocaleString()} ({percentSpent.toFixed(1)}%)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={shareItems}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={reset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-red-500 h-4 transition-all duration-300"
              style={{ width: `${percentSpent}%` }}
            ></div>
          </div>
        </div>

        {/* Shopping Cart */}
        {Object.keys(purchases).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart 🛒</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(purchases).map(([id, count]) => {
                if (count === 0) return null;
                const item = ITEMS.find(i => i.id === id);
                return (
                  <div key={id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border-2 border-purple-200">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                    <div className="text-lg font-bold text-purple-600">x{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map(item => {
            const canAfford = budget >= item.price;
            const owned = purchases[item.id] || 0;
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl ${
                  !canAfford ? 'opacity-60' : ''
                }`}
              >
                <div className="text-5xl mb-3">{item.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  ${item.price.toLocaleString()}
                </p>
                
                {owned > 0 && (
                  <div className="bg-purple-100 text-purple-800 rounded-lg px-3 py-1 mb-3 text-center font-semibold">
                    Owned: {owned}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => buyItem(item)}
                    disabled={!canAfford}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      canAfford
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Buy
                  </button>
                  {owned > 0 && (
                    <button
                      onClick={() => sellItem(item)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Sell
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            This visualizes the median Australian house price of ${MEDIAN_HOUSE_PRICE.toLocaleString()} 
            <br />
            to highlight the housing affordability crisis facing Australians.
          </p>
        </div>
      </div>
    </div>
  );
}
