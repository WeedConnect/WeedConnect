import { Hero } from "@/components/landing/hero";
import { QuickAccess } from "@/components/landing/quick-access";
import { FeatureCards } from "@/components/landing/feature-cards";
import { FeaturedContent } from "@/components/landing/featured-content";
import { CommunityRules } from "@/components/landing/community-rules";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <FeatureCards />
      <FeaturedContent />
      <CommunityRules />
    </>
  );
}
