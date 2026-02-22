import Script from "next/script";

export default function FeedbackPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 min-h-screen mt-32">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      <p className="mb-6 text-muted-foreground">
        We&apos;d love to hear your thoughts! Please fill out the form below.
      </p>
      <div
        style={{ width: "100%", height: "500px" }}
        data-fillout-id="cYVYv7m7zZus"
        data-fillout-embed-type="standard"
        data-fillout-inherit-parameters=""
        data-fillout-dynamic-resize=""
      />
      <Script src="https://server.fillout.com/embed/v1/" strategy="afterInteractive" />
    </main>
  );
}