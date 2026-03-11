export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-tighter mb-4">DANNY'S WEAR & CO.</h3>
            <p className="text-sm text-stone-500 max-w-xs">
              Premium men's and boys' fashion. Quality meets style in every stitch.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Contact Us</h4>
            <p className="text-sm text-stone-600">Phone: ++91 76765 28949</p>
            <p className="text-sm text-stone-600">Email: growworldwide01@gmail.com </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/dannys_and_co_india/" className="text-sm text-stone-600 hover:text-stone-900 transition-colors" target="_blank">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} Danny’s Wear & Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
