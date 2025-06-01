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
              Welcome to{" "}
              <span class="text-blue-600 dark:text-sky-400 italic text-7xl">Project</span>{" "}
              <span class="text-light">Board</span>
            </>
          }
          subheading="The best solution to manage your projects efficiently and effortlessly."
          buttons={[
            {
              label: "Go to Dashboard",
              href: "/dashboard",
              variant: "primary",
              showWhen: "authenticated",
            },
            {
              label: "Get Started",
              href: "/dashboard",
              variant: "secondary",
              showWhen: "unauthenticated",
            },
            {
              label: "Learn More",
              href: "/editor",
              variant: "outline",
              showWhen: "always",
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

        {/* Testimonials Section */}
        <section class="mt-20 max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div class="relative border dark:border-gray-900 rounded-lg p-8 shadow-md">
            <blockquote class="italic mb-4">
              &ldquo;{testimonials[currentTestimonial()].quote}&rdquo;
            </blockquote>
            <p class="font-semibold text-sky-600 dark:text-sky-400">
              {testimonials[currentTestimonial()].name}
            </p>
            <p class="text-sm">
              {testimonials[currentTestimonial()].title}
            </p>
            {/* Controls */}
            <div class="absolute bottom-2 right-4 flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setCurrentTestimonial(i)}
                  class={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial() === i
                      ? 'bg-sky-600 dark:bg-sky-400'
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section class="mt-20 max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-8">Choose Your Plan</h2>
          <div class="flex flex-col md:flex-row justify-center gap-8">
            {pricingPlans.map((plan) => (
              <div
                class={`flex-1 border rounded-lg p-6 cursor-pointer transition-shadow ${
                  selectedPlan() === plan.name
                    ? 'border-sky-600 shadow-lg dark:border-sky-400'
                    : 'border-gray-300 dark:border-gray-800'
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
        </section>
      </main>
    </div>
  );
}

