export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="opacity-80">&copy; {new Date().getFullYear()} ShyamSeva. All rights reserved.</p>
      </div>
    </footer>
  );
}
