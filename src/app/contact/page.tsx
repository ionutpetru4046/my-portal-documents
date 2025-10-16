
export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Contact Us</h1>
        <p className="text-gray-600 text-center mb-6">
          We'd love to hear from you! Fill out the form below or reach us directly.
        </p>
        <form className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
        <div className="mt-8 w-full text-center">
          <p className="text-gray-700 mb-2">
            Or contact us directly:
          </p>
          <div className="flex flex-col gap-2 items-center">
            <span className="font-medium text-blue-700">support@myportal.com</span>
            <span className="font-medium text-blue-700">+123 456 7890</span>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <a href="https://twitter.com/" target="_blank" rel="noopener" className="text-blue-500 hover:text-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775A4.932 4.932 0 0023.337 3.1a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.762.127 1.124C7.728 8.816 4.1 6.884 1.671 3.149c-.423.724-.666 1.562-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 1.997 1.415 3.872 3.548 4.292a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg>
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener" className="text-blue-700 hover:text-blue-900">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.727 0 1.326-.6 1.326-1.326V1.326C24 .6 23.4 0 22.675 0"/></svg>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener" className="text-blue-800 hover:text-blue-900">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.25 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
  