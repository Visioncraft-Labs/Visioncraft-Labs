import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const StickyCTA = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link href="/contact">
        <Button className="btn-luxury px-6 py-3 rounded-full shadow-2xl transition-all hover:scale-105">
          Book Now
        </Button>
      </Link>
    </div>
  );
};

export default StickyCTA;
