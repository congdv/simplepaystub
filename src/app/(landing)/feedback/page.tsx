import Script from 'next/script';

export default function FeedbackPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Feedback</h1>
        <p className="text-slate-500">We&apos;d love to hear your thoughts. Please fill out the form below.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div
          style={{ width: '100%', height: '500px' }}
          data-fillout-id="cYVYv7m7zZus"
          data-fillout-embed-type="standard"
          data-fillout-inherit-parameters=""
          data-fillout-dynamic-resize=""
        />
        <Script src="https://server.fillout.com/embed/v1/" strategy="afterInteractive" />
      </div>
    </div>
  );
}
