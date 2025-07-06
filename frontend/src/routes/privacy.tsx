import { A } from "@solidjs/router";

export default function Privacy() {
  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-neutral-900 mb-6">Privacy Policy</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. Learn how we collect, use, and protect your information on our platform.
          </p>
        </div>

        <div class="prose prose-lg max-w-none">
          <div class="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Data Collection</h2>
              <p class="text-gray-600 leading-relaxed">
                We collect information you provide directly to us when you create an account, 
                update your profile, post content, or communicate with other users on our platform.
                This includes your username, email address, and any content you choose to share.
              </p>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Data Usage</h2>
              <p class="text-gray-600 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, 
                communicate with you, personalize your experience, and ensure the security of our platform.
                We never sell your personal information to third parties.
              </p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Data Security</h2>
              <p class="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information 
                from unauthorized access, alteration, or destruction. Your data is encrypted both 
                in transit and at rest using advanced encryption protocols.
              </p>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Your Rights</h2>
              <p class="text-gray-600 leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                You can also control your privacy settings and choose what information to share 
                with other users on the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}