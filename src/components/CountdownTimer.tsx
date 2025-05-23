
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Timer } from 'lucide-react';

const targetDate = new Date('2025-05-15T23:59:59');

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-r from-[#FF6B6B] to-[#FF9A8B] py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Timer className="h-6 w-6 text-white" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Limited Time Offer</h2>
        </div>
        <p className="text-lg text-white/90 mb-8">
          Don't miss out! This special deal expires on May 15, 2025
        </p>
        
        <Card className="inline-flex gap-6 md:gap-12 p-6 bg-white/20 backdrop-blur-lg shadow-lg border border-white/30">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-sm text-white/70">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-sm text-white/70">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-sm text-white/70">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-sm text-white/70">Seconds</div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CountdownTimer;
