import { createSignal, createEffect, onCleanup } from 'solid-js';
import { useAuth } from '../contexts/AuthContext';
import FeatureCard from '../components/FeatureCard';
import Hero from '../components/Hero';

const testimonials = [
  {
    name: 'Alice Johnson',
    title: 'Product Manager',
    quote: 'Project Board transformed how our team collaborates and delivered fantastic results!',
  },
  {
    name: 'Mark Lee',
    title: 'Software Engineer',
    quote: 'The ease of use and customization saved us weeks of development time.',
  },
  {
    name: 'Sandra Kim',
    title: 'CTO',
    quote: 'Reliable and secure, it’s the backbone of our daily operations.',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '$9/mo',
    features: ['Up to 5 projects', 'Basic support', 'Community access'],
  },
  {
    name: 'Pro',
    price: '$29/mo',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    features: ['Custom solutions', 'Dedicated support', 'Onboarding assistance'],
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth(); // 🔁 Use real auth context

  const [currentTestimonial, setCurrentTestimonial] = createSignal(0);
  const [selectedPlan, setSelectedPlan] = createSignal(pricingPlans[0].name);

  // Rotate testimonials every 7 seconds
  createEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((idx) => (idx + 1) % testimonials.length);
    }, 7000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <div class="flex flex-col ">
      <main class="flex-1 px-6 py-12 md:px-12 lg:px-24">
        {/* Hero Section */}
        <Hero
          user={isAuthenticated() ? user : null}
          heading={
            <>
              Welcome to <span class="text-blue-600 dark:text-sky-400 italic text-7xl">Project</span>{' '}
              <span class="text-light">Board</span>
            </>
          }
          subheading="The best solution to manage your projects efficiently and effortlessly."
          buttons={[
            {
              label: 'Go to Dashboard',
              href: '/dashboard',
              variant: 'primary',
              showWhen: 'authenticated',
            },
            {
              label: 'Get Started',
              href: '/dashboard',
              variant: 'secondary',
              showWhen: 'unauthenticated',
            },
            {
              label: 'Learn More',
              href: '/editor',
              variant: 'outline',
              showWhen: 'always',
            },
          ]}
        />

        {/* Features Section */}
        <section class="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <FeatureCard
            icon={'mdi:hand-okay'}
            title="Easy to Use"
            description="Intuitive UI that helps you get started quickly without any hassle."
          />
          <FeatureCard
            icon={'mdi:secure'}
            title="Secure & Reliable"
            description="Your data is protected with industry-leading security measures."
          />
          <FeatureCard
            icon={'mdi:focus-field'}
            title="Customizable"
            description="Tailor the platform to your specific needs with flexible options."
          />
        </section>

        
       {/* Editor Features Section */}
<section class="mt-20 max-w-5xl mx-auto text-center">
  <h2 class="text-3xl font-bold mb-2">Powerful Editor Features</h2>
  <p class="text-lg text-gray-600 dark:text-gray-400 mb-10">
    Designed to feel like a full IDE in the browser, our editor provides a seamless development experience — complete with file navigation, in-browser coding, and an integrated terminal.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
    <FeatureCard
      icon="mdi:file-code-outline"
      title="Integrated Code Editor"
      description="Edit your files with a fast, Monaco-based editor tailored for developers."
    />
    <FeatureCard
      icon="mdi:file-tree"
      title="File Manager"
      description="Navigate your project structure easily with a dynamic file explorer."
    />
    <FeatureCard
      icon="mdi:resize"
      title="Resizable Panels"
      description="Adjust the editor and sidebar layout with flexible drag-to-resize functionality."
    />
    <FeatureCard
      icon="mdi:console"
      title="Embedded Terminal"
      description="Run commands and interact with your environment directly in the terminal drawer."
    />
    <FeatureCard
      icon="mdi:theme-light-dark"
      title="Theme & UX Enhancements"
      description="Customizable themes, smooth transitions, and IDE-like experience."
    />
    <FeatureCard
      icon="mdi:update"
      title="Live Layout Updates"
      description="Responsive design with real-time layout adjustment support."
    />
  </div>
</section>
{/* Developer Tools Hero Section */}
<section class="mt-24 mb-20 px-6 md:px-12 lg:px-24 text-center">
  <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
    Build. Edit. Speak.
  </h2>
  <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
    From a powerful, resizable code editor to an intelligent text-to-speech engine, our platform gives you everything you need to create, communicate, and deploy content faster than ever.
  </p>
  <div class="flex justify-center gap-4 flex-wrap">
    <a
      href="/editor"
      class="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-md transition"
    >
      Launch Editor
    </a>
    <a
      href="/tts"
      class="border border-sky-600 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-800 font-semibold py-2 px-6 rounded-md transition"
    >
      Try Text-to-Speech
    </a>
  </div>
</section>
{/* Text-to-Speech Section */}
<section class="mt-20 max-w-5xl mx-auto text-center">
  <h2 class="text-3xl font-bold mb-2">Text-to-Speech Generator</h2>
  <p class="text-lg text-gray-600 dark:text-gray-400 mb-10">
    Generate realistic speech from text with support for multiple languages and custom voice profiles. Perfect for narration, accessibility, and voice-driven applications.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
    <FeatureCard
      icon="mdi:text-to-speech"
      title="Multilingual Input"
      description="Supports over 20 languages and regional accents using standardized language codes."
    />
    <FeatureCard
      icon="mdi:account-voice"
      title="Custom Voice Profiles"
      description="Define multiple speakers with distinct voices and tones like Bright, Smooth, or Informative."
    />
    <FeatureCard
      icon="mdi:music-note"
      title="Real-Time Playback"
      description="Instantly listen to generated speech and download high-quality audio files."
    />
    <FeatureCard
      icon="mdi:form-textbox"
      title="Interactive Form"
      description="Dynamic speaker fields, inline validation, and easy-to-use controls built with SolidJS."
    />
    <FeatureCard
      icon="mdi:api"
      title="API Powered"
      description="Backed by a robust REST API for reliable, scalable TTS generation and playback."
    />
    <FeatureCard
      icon="mdi:progress-clock"
      title="Future Enhancements"
      description="Plans include WebSocket streaming, sample previews, and enhanced customization."
    />
  </div>
</section>

{/* Testimonials Section */}
        <section class="mt-20 max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div class="relative border rounded-lg p-8 shadow-md">
            <blockquote class="italic mb-4">&ldquo;{testimonials[currentTestimonial()].quote}&rdquo;</blockquote>
            <p class="font-semibold text-sky-600 dark:text-sky-400">{testimonials[currentTestimonial()].name}</p>
            <p class="text-sm">{testimonials[currentTestimonial()].title}</p>
            {/* Controls */}
            <div class="absolute bottom-2 right-4 flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setCurrentTestimonial(i)}
                  class={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial() === i ? 'bg-sky-600 dark:bg-sky-400' : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        {/**<section class="mt-20 max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-8">Choose Your Plan</h2>
          <div class="flex flex-col md:flex-row justify-center gap-8">
            {pricingPlans.map((plan) => (
              <div
                class={`flex-1 border rounded-lg p-6 cursor-pointer transition-shadow ${
                  selectedPlan() === plan.name ? 'border-sky-600 shadow-lg dark:border-sky-400' : ''
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <h3 class="text-2xl font-semibold mb-2 text-sky-400">{plan.name}</h3>
                <p class="text-xl mb-4">{plan.price}</p>
                <ul class="mb-6 text-left list-disc list-inside">
                  {plan.features.map((feature) => (
                    <li>{feature}</li>
                  ))}
                </ul>
                {selectedPlan() === plan.name && (
                  <button class="w-full bg-sky-500 dark:text-gray-100 hover:bg-sky-500 font-semibold py-2 rounded-md transition">
                    Select {plan.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>**/}
      </main>
    </div>
  );
}
