
import HeroSection from "@/components/Landing page/HeroSection";
import NewArrivals from "@/components/Landing page/NewArrivals";
import Sale from "@/components/Landing page/sale";




export default function Home() {
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen md:pt-20 pt-16">
        <HeroSection />
        <NewArrivals />
        <Sale/>
      </div>
    </>

  );
}
