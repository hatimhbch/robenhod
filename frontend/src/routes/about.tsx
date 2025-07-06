// about.tsx - Static page component providing information about the platform
// This component renders the "About Us" page with mission, vision, and call-to-action

export default function About() {
  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto px-4 py-16">
        {/* Hero section with main heading and description */}
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold text-neutral-900 mb-6">About Story</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A modern platform designed for writers and readers who believe in the power of great storytelling.
          </p>
        </div>

        <div class="prose prose-lg max-w-none">
          {/* Two-column layout for mission and vision sections */}
          <div class="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Our Mission</h2>
              <p class="text-gray-600 leading-relaxed">
                We believe that everyone has a story to tell. Story provides writers with the tools and community 
                they need to share their thoughts, experiences, and creativity with the world.
              </p>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-neutral-900 mb-4">Our Vision</h2>
              <p class="text-gray-600 leading-relaxed">
                To create a space where authentic voices can flourish, where readers can discover amazing content, 
                and where meaningful connections are made through the art of storytelling.
              </p>
            </div>
          </div>

          {/* Call-to-action section encouraging user registration */}
          <div class="text-center bg-gray-50 rounded-2xl p-12">
            <h2 class="text-3xl font-bold text-neutral-900 mb-6">Join Our Community</h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a seasoned writer or just starting your journey, Story welcomes you. 
              Share your voice, discover new perspectives, and be part of our growing community.
            </p>
            <a 
              href="/signup" 
              class="inline-flex items-center px-8 py-4 bg-neutral-900 text-white font-semibold rounded-full hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
