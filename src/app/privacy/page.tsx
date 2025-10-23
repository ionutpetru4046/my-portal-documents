export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="text-gray-700 max-w-3xl space-y-4">
        <p>
          Your privacy is important to us. This Privacy Policy explains how <strong>MyApp</strong> ("we", "us", "our") collects, uses, and protects your information when you use our services.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
        <ul className="list-disc list-inside">
          <li>Personal information you provide, such as name, email, and profile data.</li>
          <li>Data collected automatically, like IP address, browser type, and usage patterns.</li>
          <li>Documents and files you upload to our platform.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside">
          <li>To provide, improve, and personalize our services.</li>
          <li>To communicate with you about updates, promotions, and support.</li>
          <li>To ensure security and prevent fraud or unauthorized activity.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">3. Data Sharing</h2>
        <p>
          We do not sell or rent your personal data. We may share information with trusted third-party services that help us operate, such as cloud storage providers, analytics, and payment processors, under strict confidentiality agreements.
        </p>

        <h2 className="text-xl font-semibold mt-4">4. Your Rights</h2>
        <ul className="list-disc list-inside">
          <li>Access, update, or delete your personal information.</li>
          <li>Opt-out of marketing communications at any time.</li>
          <li>Request a copy of the data we hold about you.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">5. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2 className="text-xl font-semibold mt-4">6. Children’s Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.
        </p>

        <h2 className="text-xl font-semibold mt-4">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this page periodically.
        </p>

        <p className="mt-6 text-gray-500 text-sm">
          Last updated: October 24, 2025
        </p>
      </div>
    </div>
  );
}
