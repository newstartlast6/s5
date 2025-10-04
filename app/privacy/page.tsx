import React from "react";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: `Welcome to RemoveSoraWatermark.pro ("we", "us", or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you access or use our website and services (collectively, the "Service"). By using our Service, you agree to the practices described in this Privacy Policy and our Terms of Service. If you do not agree with these policies, please discontinue use of our Service immediately.`,
    },
    {
      id: "definitions",
      title: "2. Definitions",
      content: `SERVICE refers to the website RemoveSoraWatermark.pro and all associated services provided.

PERSONAL DATA means any information relating to an identified or identifiable individual.

USAGE DATA refers to data collected automatically from your use of the Service, including IP address, browser type, device information, pages visited, and timestamps.

COOKIES are small data files stored on your device to enhance user experience and collect analytics.

USER CONTENT refers to any videos, files, or other materials you upload to or process through our Service.

DATA CONTROLLER means RemoveSoraWatermark.pro, which determines how and why Personal Data is processed.

USER refers to any individual accessing or using our Service.`,
    },
    {
      id: "information-collection",
      title: "3. Information We Collect",
      content: `We collect information necessary to provide and improve our Service, including:

Personal Data: When you use our Service, we may collect your email address, name, payment information (processed by third-party payment providers), and account credentials.

Usage Data: We automatically collect technical information including your IP address, browser type, operating system, device identifiers, pages visited, time spent on pages, referring URLs, and interaction data with our Service.

Video Files and Content: When you upload videos for watermark removal, we temporarily process these files. We do not claim ownership of your content.

Cookies and Tracking Technologies: We use cookies, web beacons, and similar technologies to track activity, store preferences, and analyze usage patterns.`,
    },
    {
      id: "use-of-data",
      title: "4. How We Use Your Information",
      content: `We use collected information for the following purposes:

(a) To provide, operate, and maintain our watermark removal Service;
(b) To process your video files and deliver processed content to you;
(c) To manage your account and authenticate users;
(d) To process payments and prevent fraudulent transactions;
(e) To communicate with you regarding your account, service updates, and support requests;
(f) To improve, personalize, and optimize our Service based on usage patterns;
(g) To monitor and analyze trends, usage, and activities in connection with our Service;
(h) To detect, prevent, and address technical issues, security threats, and fraudulent activity;
(i) To comply with legal obligations and enforce our Terms of Service;
(j) To send promotional communications (you may opt out at any time).`,
    },
    {
      id: "video-processing",
      title: "5. Video Content Processing and Storage",
      content: `Uploaded Content: When you upload videos to our Service, they are temporarily stored on our servers solely for the purpose of processing and watermark removal.

Processing: Your videos are processed using automated systems. We do not manually review your content unless required for technical support or legal compliance.

Retention: Uploaded and processed videos are automatically deleted from our servers within 24-48 hours after processing is complete. You are responsible for downloading your processed files within this timeframe.

No Ownership Claims: You retain all ownership rights to your uploaded content. By using our Service, you grant us a limited, non-exclusive, temporary license to process your videos solely for the purpose of providing the watermark removal service.

User Responsibility: You represent and warrant that you have all necessary rights and permissions to upload and process the content you submit. You are solely responsible for ensuring your use of the Service complies with applicable laws and does not infringe on third-party rights.`,
    },
    {
      id: "liability-disclaimer",
      title: "6. Limitation of Liability and User Responsibilities",
      content: `Service Use: Our Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free, or secure operation.

User Content Liability: You acknowledge and agree that:
(a) You are solely responsible for all content you upload and process through our Service;
(b) You must have all necessary rights, licenses, and permissions for any content you upload;
(c) We are not liable for any copyright infringement, intellectual property violations, or legal claims arising from your use of the Service;
(d) You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service or your uploaded content.

Third-Party Content: If you process videos containing third-party copyrighted material, you do so at your own risk and are solely responsible for obtaining necessary permissions.

No Liability for Damages: To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Service, including loss of data, loss of revenue, or business interruption.

Maximum Liability: Our total liability for any claims related to the Service shall not exceed the amount you paid us in the twelve months preceding the claim.`,
    },
    {
      id: "data-sharing",
      title: "7. Disclosure and Sharing of Information",
      content: `We may disclose your information in the following circumstances:

(a) Service Providers: We share data with third-party vendors who assist with hosting, payment processing, analytics, and customer support;
(b) Legal Requirements: We may disclose information to comply with legal obligations, court orders, or government requests;
(c) Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity;
(d) Protection of Rights: We may disclose information to protect our rights, property, safety, or that of our users or the public;
(e) With Consent: We may share information with your explicit consent or at your direction.

We do not sell your Personal Data to third parties for marketing purposes.`,
    },
    {
      id: "data-security",
      title: "8. Data Security",
      content: `We implement industry-standard security measures to protect your information, including encryption, secure servers, and access controls. However, no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your data, we cannot guarantee absolute security.

You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized access or security breaches.`,
    },
    {
      id: "data-retention",
      title: "9. Data Retention",
      content: `Personal Data: We retain your Personal Data for as long as your account is active or as needed to provide our Service, comply with legal obligations, resolve disputes, and enforce our agreements.

Video Content: As stated above, uploaded and processed videos are automatically deleted within 24-48 hours after processing.

Usage Data: We may retain Usage Data for longer periods for analytics and service improvement purposes, typically aggregated and anonymized.

You may request deletion of your Personal Data by contacting us at mail.bizacc2025@gmail.com, subject to legal retention requirements.`,
    },
    {
      id: "international-transfers",
      title: "10. International Data Transfers",
      content: `Your information may be transferred to, stored, and processed in countries other than your country of residence, including countries that may have different data protection standards. By using our Service, you consent to the transfer of your information to these locations. We take appropriate measures to ensure your data receives adequate protection in accordance with this Privacy Policy.`,
    },
    {
      id: "gdpr-rights",
      title: "11. Your Rights Under GDPR (EU/EEA Users)",
      content: `If you are located in the European Union or European Economic Area, you have the following rights under the General Data Protection Regulation:

(a) Right to Access: Request copies of your Personal Data;
(b) Right to Rectification: Request correction of inaccurate or incomplete data;
(c) Right to Erasure: Request deletion of your Personal Data;
(d) Right to Restrict Processing: Request limitation of how we process your data;
(e) Right to Data Portability: Request transfer of your data to another service;
(f) Right to Object: Object to processing of your Personal Data;
(g) Rights Related to Automated Decision-Making: Rights regarding automated processing and profiling.

To exercise these rights, contact us at mail.bizacc2025@gmail.com. We will respond within one month of receiving your request.`,
    },
    {
      id: "california-rights",
      title: "12. California Privacy Rights (CCPA/CPRA)",
      content: `California residents have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):

(a) Right to Know: Request disclosure of Personal Data we collect, use, and share;
(b) Right to Delete: Request deletion of your Personal Data;
(c) Right to Opt-Out: Opt out of the sale or sharing of Personal Data (we do not sell Personal Data);
(d) Right to Non-Discrimination: Not receive discriminatory treatment for exercising your privacy rights;
(e) Right to Correct: Request correction of inaccurate Personal Data;
(f) Right to Limit Use of Sensitive Personal Information.

To exercise these rights, contact us at mail.bizacc2025@gmail.com or use our online form. We will verify your identity before processing requests.`,
    },
    {
      id: "cookies",
      title: "13. Cookies and Tracking Technologies",
      content: `We use cookies and similar technologies to:
- Remember your preferences and settings;
- Authenticate users and prevent fraud;
- Analyze site traffic and usage patterns;
- Provide personalized content and advertising;
- Improve Service performance and user experience.

Cookie Types:
- Essential Cookies: Necessary for Service functionality;
- Analytics Cookies: Help us understand how users interact with our Service;
- Advertising Cookies: Used to deliver relevant advertisements.

You can control cookies through your browser settings. Disabling certain cookies may limit Service functionality.`,
    },
    {
      id: "third-party-services",
      title: "14. Third-Party Services and Links",
      content: `Our Service may use third-party services for payment processing, analytics, hosting, and other functions. These providers have their own privacy policies, and we are not responsible for their practices.

Our Service may contain links to external websites. We are not responsible for the privacy practices or content of third-party sites. We encourage you to review their privacy policies.`,
    },
    {
      id: "payment-processing",
      title: "15. Payment Information",
      content: `We use third-party payment processors (such as Stripe, PayPal, or similar services) to handle all payment transactions. We do not directly collect, store, or process your payment card details.

Payment information is handled securely by our payment partners in compliance with PCI-DSS standards. Please review their privacy policies for information about how they protect your payment data.`,
    },
    {
      id: "children-privacy",
      title: "16. Children's Privacy",
      content: `Our Service is not intended for individuals under the age of 18. We do not knowingly collect Personal Data from children under 18. If we become aware that we have collected data from a child under 18, we will take steps to delete such information promptly.

If you are a parent or guardian and believe your child has provided us with Personal Data, please contact us at mail.bizacc2025@gmail.com.`,
    },
    {
      id: "do-not-track",
      title: "17. Do Not Track Signals",
      content: `Some browsers transmit "Do Not Track" (DNT) signals. Our Service does not currently respond to DNT signals. We continue to collect information as described in this Privacy Policy regardless of DNT settings.`,
    },
    {
      id: "changes-to-policy",
      title: "18. Changes to This Privacy Policy",
      content: `We reserve the right to modify this Privacy Policy at any time. Changes will be effective immediately upon posting to this page. We will notify you of material changes via email (if provided) or through a prominent notice on our Service.

Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy. We encourage you to review this Privacy Policy periodically.

Last Updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    },
    {
      id: "contact",
      title: "19. Contact Information",
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Email: mail.bizacc2025@gmail.com

For GDPR-related inquiries, please use the subject line "GDPR Request"
For CCPA-related inquiries, please use the subject line "CCPA Request"

We will respond to all requests within 30 days.`,
    },
    {
      id: "acceptance",
      title: "20. Acceptance of This Policy",
      content: `By using RemoveSoraWatermark.pro, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy and our Terms of Service. If you do not agree, you must immediately cease using our Service.`,
    },
  ];

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

        {sections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {section.title}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </section>
        ))}

        <section className="mb-8 p-6 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Important Notice:</strong> This Privacy Policy is designed to protect both our users and our business. By using our Service, you acknowledge that you have read and understood all terms, especially those regarding user content liability, data processing, and limitations of liability.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;