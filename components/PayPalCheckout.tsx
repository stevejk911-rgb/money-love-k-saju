
import React, { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    paypal?: any;
  }
}

type Props = {
  price: string;
  currency?: string;
  onSuccess?: (details: any) => void;
  onError?: (err: any) => void;
};

export default function PayPalCheckout({
  price,
  currency = "USD",
  onSuccess,
  onError,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initPayPal = () => {
      if (!isMounted) return;
      
      if (window.paypal && containerRef.current) {
        setIsInitializing(false);
        try {
          containerRef.current.innerHTML = "";
          
          window.paypal
            .Buttons({
              style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'pay',
                height: 54
              },
              createOrder: (data: any, actions: any) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: currency,
                        value: price,
                      },
                      description: "K-SAJU // PREMIUM SOUL CODE ACCESS"
                    },
                  ],
                });
              },
              onApprove: async (data: any, actions: any) => {
                try {
                  const details = await actions.order.capture();
                  onSuccess?.(details);
                } catch (e) {
                  console.error("Capture Error", e);
                  setError("Payment verification failed. Energy link unstable.");
                }
              },
              onError: (err: any) => {
                console.error("PayPal Interaction Error:", err);
                setError("Gateway sync failed. Please check your connection.");
                onError?.(err);
              },
              // Optimized Funding Sources
              disableFunding: ["card", "credit", "paylater"],
            })
            .render(containerRef.current);
        } catch (e) {
          console.error("PayPal Render Error", e);
          setError("Gateway initialization failed.");
        }
      } else {
        setTimeout(initPayPal, 300);
      }
    };

    initPayPal();
    return () => { isMounted = false; };
  }, [price, currency, onSuccess, onError]);

  return (
    <div className="w-full">
      {isInitializing && !error && (
        <div className="flex flex-col items-center justify-center py-10 bg-zinc-900/20 border border-zinc-800/30">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-red-700" />
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] animate-pulse">
            Syncing Ledger...
          </span>
        </div>
      )}
      
      {error && (
        <div className="p-8 bg-red-900/10 border border-red-700/30 text-center animate-fade-in-up">
          <AlertCircle className="w-10 h-10 text-red-700 mx-auto mb-4" />
          <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-widest leading-relaxed">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 text-[9px] text-red-700 font-black uppercase tracking-[0.4em] underline underline-offset-8 decoration-1 hover:text-red-500 transition-colors"
          >
            REFRESH SYSTEM
          </button>
        </div>
      )}

      <div ref={containerRef} className={`${isInitializing || error ? 'hidden' : 'block'} animate-fade-in`} />
    </div>
  );
}
