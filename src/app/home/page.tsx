"use client";
import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
const inter = Inter({ subsets: ["latin"] });

interface TokenData {
  userId: string;
  email: string;
  userType: string;
  exp: number;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }

    try {
      const decoded: TokenData = jwt_decode(token);
      const currentTime = Date.now() / 1000; // in seconds
      if (decoded.exp < currentTime) {
        // Token expired
        sessionStorage.removeItem("token");
        router.push("/auth");
        return;
      } else {
        setUser({
          id: decoded.userId,
          email: decoded.email,
          userType: decoded.userType,
        });
      }
    } catch (error) {
      console.error("Invalid token:", error);
      sessionStorage.removeItem("token");
      router.push("/auth");
      return;
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/auth");
  };
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <Head>
        <title>Simple Next.js Home</title>
        <meta
          name="description"
          content="A simple home page built with Next.js and Tailwind CSS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Multicart</div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
          <div className="text-gray-700 hover:text-blue-600 transition-colors">
            <button
              onClick={handleLogout}
              className="bg-green-100 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Logout{" "}
            </button>
          </div>
          <button className="md:hidden text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Our Website,{user ? ` ${user.name}` : ""}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing features and services that we offer to our
            customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Fast & Reliable
              </h3>
              <p className="text-gray-600">
                Our services are optimized for speed and reliability.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Secure
              </h3>
              <p className="text-gray-600">
                We prioritize the security of your data and privacy.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                User-Friendly
              </h3>
              <p className="text-gray-600">
                Designed with simplicity and ease of use in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers using our services.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyApp</h3>
              <p className="text-gray-400">
                Making your life easier with our innovative solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
