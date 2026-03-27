'use client';

import { PaystubForm } from './paystub-form';
import PaystubPreview from './paystub-preview';
import Toolbar from './toolbar';

export default function PaystubContent() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toolbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 mb-12">
        <div className="lg:col-span-5">
          <PaystubForm />
        </div>
        <div className="lg:col-span-7">
          <PaystubPreview />
        </div>
      </div>
    </div>
  );
}
