import "./globals.css";
export default function Layout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gradient-to-r from-[#1a0f3d] to-[#72026d] text-white overflow-x-hidden">
        <main>{children}</main>
      </body>
    </html>
  );
}
