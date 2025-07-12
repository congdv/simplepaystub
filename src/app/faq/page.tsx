import { Footer } from '@/components/footer';

export default function FAQ() {
  const faqs = [
    {
      question: 'Is my data safe and private?',
      answer:
        "Yes, your privacy is our top priority. Currently, all paystub information is saved locally in your browser and never leaves your device. We don't store any personal or financial data on our servers.",
    },
    {
      question: 'Do you track my data or activity?',
      answer:
        'We may collect basic analytics data (like page visits and general usage patterns) to improve our service, but we never track or store your personal information or paystub data. Your financial information remains completely private.',
    },
    {
      question: 'What analytics data do you collect?',
      answer:
        'We only collect anonymous usage analytics such as page views, button clicks, and general navigation patterns. This helps us understand how users interact with our app to make improvements. No personal data, paystub information, or identifying details are ever collected.',
    },
    {
      question: 'Where is my paystub data stored?',
      answer:
        "Currently, your paystub data is stored locally in your browser's storage. This means only you have access to it, and it's never transmitted to our servers. We may offer optional cloud sync features in the future.",
    },
    {
      question: 'What happens if I clear my browser data?',
      answer:
        "If you clear your browser's local storage or cookies, your saved paystub data will be lost. We recommend downloading or printing important paystubs for your records. Future cloud sync options may provide additional backup solutions.",
    },
    {
      question: 'Can I access my data from different devices?',
      answer:
        'Currently, since data is stored locally in your browser, you cannot access the same data from different devices. Each device has its own separate local storage. We may introduce cloud sync features in the future to enable cross-device access.',
    },
    {
      question: 'How do I delete my data?',
      answer:
        'Use the Reset button when creating your paystub, or clear your browser data. Since everything is currently stored locally, this removes it completely.',
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about privacy and data security
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Still have questions?</h3>
              <p className="text-blue-700">
                Your privacy and security are our commitment. All processing happens locally in your
                browser.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
