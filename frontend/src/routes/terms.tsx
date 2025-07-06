import { A } from "@solidjs/router";

export default function Terms() {
  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-neutral-900 mb-6">Terms of Service</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The rules and guidelines that keep our community awesome and our platform running smoothly.
          </p>
        </div>

        <div class="prose prose-lg max-w-none">
          <div class="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Community Guidelines</h2>
              <p class="text-gray-600 leading-relaxed">
                By accessing and using Story, you agree to be bound by these Terms of Service. 
                Our platform is designed to foster creativity, encourage meaningful discussions, 
                and build a supportive community for writers and readers alike.
              </p>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Acceptable Use</h2>
              <p class="text-gray-600 leading-relaxed">
                We encourage original, creative content that inspires and educates. Respectful 
                engagement with other community members is essential. We do not tolerate harassment, 
                hate speech, spam, or any form of malicious content.
              </p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Content & Copyright</h2>
              <p class="text-gray-600 leading-relaxed">
                You retain full ownership of the content you create and publish on Story. 
                By posting content, you grant us a license to display, distribute, and promote 
                your work on our platform. We respect intellectual property rights and expect our users to do the same.
              </p>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Platform Availability</h2>
              <p class="text-gray-600 leading-relaxed">
                While we strive to maintain 99.9% uptime, we cannot guarantee uninterrupted access 
                to Story. We may temporarily suspend the service for maintenance, updates, or 
                unforeseen technical issues with advance notice when possible.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 