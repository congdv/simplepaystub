export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4 min-h-screen mt-32">
      <h1 className="text-2xl font-bold mb-4">Privacy Notice</h1>
      <p className="mb-2">
        Your privacy is important to us. SimplePaystub.com collects only the information necessary to generate your paystub.
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>We do not share your data with third parties.</li>
        <li>Your data is used solely for generating paystubs and is not stored permanently.</li>
        <li>For questions or concerns, please contact us via the Help page.</li>
      </ul>
    </main>
  );
}