'use client';
import { FeedbackButton } from '@/components/feedback-button';

// Simple feedback button examples that open https://simplepaystub.canny.io/

/**
 * Header feedback button for navigation bars
 */
export function HeaderFeedbackButton() {
  return (
    <FeedbackButton
      variant="inline"
      className="text-sm"
      showIcon={false}
    >
      Feedback
    </FeedbackButton>
  );
}

/**
 * Footer feedback button for page footers
 */
export function FooterFeedbackButton() {
  return (
    <FeedbackButton
      variant="inline"
      className="text-sm text-gray-600 hover:text-gray-900 border-gray-300"
    >
      Send Feedback
    </FeedbackButton>
  );
}

/**
 * Settings page feedback button
 */
export function SettingsFeedbackButton() {
  return (
    <FeedbackButton
      variant="inline"
      className="w-full justify-center"
    >
      Share Feedback & Feature Requests
    </FeedbackButton>
  );
}

/**
 * Feedback section for help/support pages
 */
export function FeedbackSection() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Help us improve
      </h3>
      <p className="text-gray-600 mb-4">
        Have suggestions or found a bug? We&apos;d love to hear from you!
      </p>
      <FeedbackButton variant="inline" className="bg-blue-600 hover:bg-blue-700 text-white">
        Send Feedback
      </FeedbackButton>
    </div>
  );
}