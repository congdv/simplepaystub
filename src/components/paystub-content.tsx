'use client';

import { PaystubForm } from './paystub-form';
import PaystubPreview from './paystub-preview';
import Toolbar from './toolbar';

export default function PaystubContent() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <Toolbar />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mt-10">
        <div className="lg:col-span-2">
          <PaystubForm />
        </div>

        <div className="lg:col-span-3">
          <PaystubPreview />
        </div>
      </div>
    </div>
  );
}
