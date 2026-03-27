export default function PrivacyPage() {
  const items = [
    {
      title: 'Local by default',
      body: "Your paystub information is stored in your browser's local storage by default. That means the data stays on the device you used to create it unless you choose to share or export it.",
    },
    {
      title: 'Server use is temporary',
      body: 'If you ask us to generate a PDF or send a paystub by email, the paystub data is transmitted to our server only for that task. We use it solely to create or send the PDF and do not keep it for other purposes.',
    },
    {
      title: 'Anonymous analytics only',
      body: 'We may collect basic, non-identifying usage data (like page views and button clicks) to help improve the app. This data is anonymous and never includes your paystub or personal financial details.',
    },
    {
      title: 'Your control',
      body: "You can reset or clear your paystub information at any time using the app's Reset button or by clearing your browser data.",
    },
    {
      title: 'Device-specific storage',
      body: "Because data is stored locally, it won't sync across your devices. If you need access from another device, download or print your paystub.",
    },
    {
      title: 'Data loss warning',
      body: 'Clearing your browser storage or cookies will erase any saved paystubs. We recommend downloading important paystubs for safekeeping.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Notice</h1>
        <p className="text-slate-400 text-sm">Last updated: August 23, 2025</p>
        <p className="text-slate-500 mt-3">
          At SimplePaystub.com, your privacy matters. We keep things simple and transparent about how your data is handled.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6 text-center">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Questions or Concerns?</h3>
        <p className="text-slate-500 text-sm">
          If you have any questions about privacy or data security, please contact us at{' '}
          <a href="mailto:support@simplepaystub.com" className="text-primary hover:underline">
            support@simplepaystub.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
