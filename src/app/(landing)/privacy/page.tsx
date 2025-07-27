export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen mt-32">
      <h1 className="text-2xl font-bold mb-4">Privacy Notice</h1>
      <p className="mb-4">
        At SimplePaystub.com, your privacy is our top priority. We are committed to protecting your personal and financial information by following these principles:
      </p>
      <ul className="list-disc pl-5 mb-6 space-y-2">
        <li>
          <strong>No Data Leaves Your Device:</strong> All paystub information you enter is processed and stored locally in your browser. We do not transmit, store, or share your paystub data or personal details on our servers.
        </li>
        <li>
          <strong>No Personal Tracking:</strong> We do not track your personal or financial information. Any analytics we collect are anonymous and used solely to improve the user experience.
        </li>
        <li>
          <strong>Anonymous Analytics Only:</strong> We may collect basic, non-identifiable usage data such as page visits and button clicks. This data helps us improve our service, but never includes your paystub or personal information.
        </li>
        <li>
          <strong>Your Control:</strong> You have full control over your data. You can reset or clear your paystub information at any time by using the app’s reset feature or by clearing your browser data.
        </li>
        <li>
          <strong>Device-Specific Storage:</strong> Because your data is stored in your browser, it is not accessible from other devices. If you need to keep a record, please download or print your paystub.
        </li>
        <li>
          <strong>Data Loss Warning:</strong> If you clear your browser’s local storage or cookies, your saved paystub data will be lost. We recommend saving important paystubs externally.
        </li>
      </ul>
      <p className="mb-4">
        We may introduce optional cloud features in the future, but your privacy and security will always remain our core commitment.
      </p>
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