export default function HelpPage() {
  const items = [
    {
      question: 'How do I generate a paystub?',
      answer: 'Fill out the form on the home page and click "Download" or "Send PDF to Email".',
    },
    {
      question: "Didn't receive your email?",
      answer: 'Please check your spam or junk folder. If the issue persists, contact us.',
    },
    {
      question: 'Still need help?',
      answer: (
        <>
          Contact us at{' '}
          <a href="mailto:support@simplepaystub.com" className="text-primary hover:underline">
            support@simplepaystub.com
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Help Center</h1>
        <p className="text-slate-500">Common questions and answers to get you started</p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-2">{item.question}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
