import { Component } from 'solid-js';
import { A } from '@solidjs/router';

const Footer: Component = () => {
  return (
    <footer class="bg-gray-900 text-white">
      <div class="container-custom py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div class="space-y-4">
            <h3 class="text-2xl font-bold">SolidBlog</h3>
            <p class="text-gray-400">Share your stories with the world.</p>
          </div>

          {/* Quick Links */}
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Quick Links</h4>
            <div class="flex flex-col space-y-2">
              <A href="/about" class="footer-link">About Us</A>
              <A href="/terms" class="footer-link">Terms of Service</A>
              <A href="/privacy" class="footer-link">Privacy Policy</A>
            </div>
          </div>

          {/* Contact */}
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Contact</h4>
            <div class="flex flex-col space-y-2 text-gray-400">
              <a href="mailto:contact@solidblog.com">contact@solidblog.com</a>
              <p>123 Blog Street</p>
              <p>Blog City, BC 12345</p>
            </div>
          </div>

          {/* Social Links */}
          <div class="space-y-4">
            <h4 class="text-lg font-semibold">Follow Us</h4>
            <div class="flex space-x-4">
              {/* Add social media icons/links here */}
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SolidBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
