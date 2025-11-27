import React from "react";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative flex flex-col justify-center w-full min-h-screen lg:flex-row">
        {/* Left side - Auth Form */}
        <div className="flex items-center justify-center w-full lg:w-1/2 p-6 sm:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Right side - Fashion Brand Showcase */}
        <div className="hidden lg:flex items-center justify-center w-full lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
          {/* Background Pattern */}
          <GridShape />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-12 space-y-8">
            {/* Logo/Brand Icon */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            {/* Brand Title */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white tracking-tight">
                DaVinci
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"></div>
              <p className="text-xl font-light text-gray-300 tracking-widest uppercase">
                Fashion House
              </p>
            </div>

            {/* Tagline */}
            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Quản lý cửa hàng thời trang cao cấp với phong cách và sự tinh tế
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-700/50">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Dễ dàng</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Nhanh chóng</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-400">Bảo mật</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggler */}
        <div className="fixed z-50 bottom-6 right-6">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
