export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen mt-32">
      <h1 className="text-2xl font-bold mb-2">Privacy Notice</h1>
      <p className="text-sm text-muted-foreground mb-4">Last updated: August 23, 2025</p>
      <p className="mb-4">
        At SimplePaystub.com, your privacy matters. We keep things simple and transparent about how your data is handled.
      </p>

      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li>
          <strong>Local by default:</strong> Your paystub information is stored in your browser's local storage by default. That means the data stays on the device you used to create it unless you choose to share or export it.
        </li>
        <li>
          <strong>Server use is temporary:</strong> If you ask us to generate a PDF or send a paystub by email, the paystub data is transmitted to our server only for that task. We use it solely to create or send the PDF and do not keep it for other purposes.
        </li>
        <li>
          <strong>Anonymous analytics only:</strong> We may collect basic, non-identifying usage data (like page views and button clicks) to help improve the app. This data is anonymous and never includes your paystub or personal financial details.
        </li>
        <li>
          <strong>Your control:</strong> You can reset or clear your paystub information at any time using the app's Reset button or by clearing your browser data.
        </li>
        <li>
          <strong>Device-specific storage:</strong> Because data is stored locally, it won't sync across your devices. If you need access from another device, download or print your paystub.
        </li>
        <li>
          <strong>Data loss warning:</strong> Clearing your browser storage or cookies will erase any saved paystubs. We recommend downloading important paystubs for safekeeping.
        </li>
      </ul>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 text-center mt-8">
        <h3 className="text-base font-semibold text-blue-900 mb-2">Questions or Concerns?</h3>
        <p className="text-blue-700">
          If you have any questions about privacy or data security, please contact us at{' '}
          <a href="mailto:support@simplepaystub.com" className="underline">
            support@simplepaystub.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}