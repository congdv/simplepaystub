export default function FAQ() {
  const faqs = [
    {
      question: 'How accurate are the tax calculations?',
      answer:
        'All tax and withholding amounts — including Auto Tax — are estimates based on standard tax tables and the information you enter. They do not account for your complete financial situation (additional income, credits, dependents, wage-base caps, year-to-date totals, or local taxes) and may differ from your actual tax liability. Our paystubs are intended as reasonable estimates for personal reference and are not tax, legal, or financial advice. Before relying on any figure for filing, employment, or legal purposes, please verify with your employer’s payroll department, a certified tax professional, or the appropriate tax authority (IRS, CRA, or your state/provincial agency).',
    },
    {
      question: 'Do you track my data or activity?',
      answer:
        'We may collect basic analytics data (like page visits and general usage patterns) to improve our service, but we never track or store your personal information or paystub data.',
    },
    {
      question: 'What analytics data do you collect?',
      answer:
        'We only collect anonymous usage analytics such as page views, button clicks, and general navigation patterns. This helps us understand how users interact with our app to make improvements. No personal data, paystub information, or identifying details are ever collected.',
    },
    {
      question: 'Where is my paystub data stored?',
      answer:
        "Currently, your paystub data is stored locally in your browser's storage.",
    },
    {
      question: 'Is my data safe and private?',
      answer:
        "Yes — your privacy is our top priority. By default, paystub information is stored locally in your browser. When you request a PDF or send a paystub by email, the data is transmitted to our server temporarily for processing; it is used only to generate or send the PDF and is not retained for other purposes.",
    },
    {
      question: 'What happens if I clear my browser data?',
      answer:
        "If you clear your browser's local storage or cookies, your saved paystub data will be lost. We recommend downloading or printing important paystubs for your records. Future cloud sync options may provide additional backup solutions.",
    },
    {
      question: 'Can I access my data from different devices?',
      answer:
        'Currently, since data is stored locally in your browser, you cannot access the same data from different devices. Each device has its own separate local storage.',
    },
    {
      question: 'How do I delete my data?',
      answer:
        'Use the Reset button when creating your paystub, or clear your browser data. Since everything is currently stored locally, this removes it completely.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-slate-500">Everything you need to know about tax estimates, privacy, and data security</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.question}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg border border-slate-200 p-6 text-center">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Still have questions?</h3>
        <p className="text-slate-500 text-sm">
          Your privacy and security are our commitment. Contact us at{' '}
          <a href="mailto:support@simplepaystub.com" className="text-primary hover:underline">
            support@simplepaystub.com
          </a>
        </p>
      </div>
    </div>
  );
}
