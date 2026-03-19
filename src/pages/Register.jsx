import Card from '../components/Card';
import Button from '../components/Button';
import { Calendar } from 'lucide-react';

export default function Register() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register Member</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new gym member</p>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-6">Member Details</h2>
        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Name *</label>
            <input type="text" placeholder="Full name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Phone Number *</label>
            <input type="text" placeholder="+1 555-0100" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Start Date</label>
              <div className="relative">
                <input type="text" defaultValue="03/11/2026" className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400" />
                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Duration (days)</label>
              <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Extra Days</label>
              <input type="number" defaultValue="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Fee (₹)</label>
              <input type="text" placeholder="e.g. 1000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Notes</label>
            <textarea placeholder="e.g. Paid via Zaad, receipt #12345" rows="3" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"></textarea>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-2 border border-gray-100">
            <p className="text-sm text-gray-700">Calculated Expiry Date</p>
            <p className="text-lg font-bold text-brand-500 mt-0.5">2026-04-10</p>
          </div>

          <div className="flex gap-3 mt-4">
            <Button type="button" className="flex-1 py-2.5 text-base">Register Member</Button>
            <Button type="button" variant="ghost" className="px-6">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}