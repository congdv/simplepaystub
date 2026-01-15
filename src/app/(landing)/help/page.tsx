export default function HelpPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 min-h-screen mt-32">
      <h1 className="text-2xl font-bold mb-4">Help</h1>
      <p className="mb-2">
        Need assistance with SimplePaystub.com? Here are some common questions:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li><strong>How do I generate a paystub?</strong> Fill out the form and click "Download" or "Send PDF to Email".</li>
        <li><strong>Didn't receive your email?</strong> Please check your spam or junk folder.</li>
        <li><strong>Still need help?</strong> Contact us at <a href="mailto:support@simplepaystub.com" className="underline">support@simplepaystub.com</a>.</li>
      </ul>
    </main>
  )
}