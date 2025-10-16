export default function ContactPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-700 text-center max-w-xl mb-4">
          You can reach us via email at <span className="font-medium">support@myportal.com</span> or call us at <span className="font-medium">+123 456 7890</span>.
        </p>
        <p className="text-gray-700 text-center max-w-xl">
          We aim to respond to all inquiries within 24 hours.
        </p>
      </div>
    );
  }
  