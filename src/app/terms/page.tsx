export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

      <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl w-full space-y-6">
        <p className="text-gray-700">
          Welcome to <strong>MyApp</strong>. By using our services, you agree to comply with these Terms & Conditions. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By accessing or using our website or services, you accept these terms and agree to be bound by them. If you do not agree, please do not use our services.
        </p>

        <h2 className="text-xl font-semibold mt-4">2. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>You must provide accurate and up-to-date information when registering.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You agree not to misuse our services or engage in illegal activities.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">3. Prohibited Activities</h2>
        <p className="text-gray-700">
          Users are prohibited from:  
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Distributing malicious software or viruses.</li>
          <li>Attempting unauthorized access to other accounts or systems.</li>
          <li>Violating applicable laws or regulations.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">4. Intellectual Property</h2>
        <p className="text-gray-700">
          All content, logos, graphics, and software on this website are the property of <strong>MyApp</strong> or its licensors and are protected by intellectual property laws.
        </p>

        <h2 className="text-xl font-semibold mt-4">5. Termination</h2>
        <p className="text-gray-700">
          We reserve the right to suspend or terminate your access to the services at our discretion, without notice, for violation of these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-4">6. Limitation of Liability</h2>
        <p className="text-gray-700">
          To the maximum extent permitted by law, <strong>MyApp</strong> is not liable for any indirect, incidental, or consequential damages arising from your use of our services.
        </p>

        <h2 className="text-xl font-semibold mt-4">7. Changes to Terms</h2>
        <p className="text-gray-700">
          We may update these Terms & Conditions from time to time. Updates will be posted on this page. Continued use of the services indicates your acceptance of the updated terms.
        </p>

        <p className="mt-6 text-gray-500 text-sm text-center">
          Last updated: October 24, 2025
        </p>
      </div>
    </div>
  );
}
