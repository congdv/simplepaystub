export default function TermsPage() {
  const items = [
    {
      title: 'No warranty',
      body: 'This service is provided as-is, without warranty of any kind.',
    },
    {
      title: 'Your responsibility',
      body: 'You are responsible for the accuracy of the information you provide.',
    },
    {
      title: 'Updates to terms',
      body: 'We reserve the right to update these terms at any time.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500">
          Welcome to SimplePaystub.com. By using our service, you agree to the following terms and conditions.
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
        <h3 className="text-base font-semibold text-slate-900 mb-1">Questions about these terms?</h3>
        <p className="text-slate-500 text-sm">
          Visit our{' '}
          <a href="/help" className="text-primary hover:underline">
            Help Center
          </a>{' '}
          or contact us at{' '}
          <a href="mailto:support@simplepaystub.com" className="text-primary hover:underline">
            support@simplepaystub.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
