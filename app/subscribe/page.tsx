"use client"
import SubscriptionCard from '@/components/SubscriptionCard';
import { availablePlans } from '@/lib/plan';
import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast, { Toaster } from "react-hot-toast";

type SubscribeResponse = {
  url: string;
}

type SubscribeError = {
  error: string;
}

async function SubscribeToPlan(planType: string, userId: string, email: string): Promise<SubscribeResponse> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({planType, userId, email}),
  });

  if(!res.ok) {
    const errorData:SubscribeError = await res.json();
    throw new Error(errorData.error || "Failed to subscribe");
  }
  const data:SubscribeResponse = await res.json();
  return data;
}


export default function Subscribe () {
  const router = useRouter();
  const {user} = useUser();
  const userId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  const {mutate, isPending} = useMutation<SubscribeResponse, SubscribeError, {planType: string}>({
    mutationFn: async({planType}) => {
      if (!userId) {
        throw new Error("User not found");
      }
      return SubscribeToPlan(planType, userId, email);
    },

    onMutate: () => {
      toast.loading("Subscribing to plan...");
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },

    onError: (error) => {
      toast.error("Error subscribing to plan");
    },
  });

  function handleSubscribe(planType: string) {
    if(!userId) {
      router.push("/sign-up");
      return
    }
    mutate({planType});
  }

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16">

      <div>
        <h2 className="heading">
          Pricing
        </h2>
        <p className="sub-heading">
          Get started on our weekly plan or upgrade to monthly or yearly when
          you’re ready.
        </p>
        <div className="subscription-container">
        {availablePlans.map((plan, key) => (
            <div
              key={key}
              className="
                subscription-option-card
              "
            >
              <div className="flex-1">
                {/* Conditionally render "Most popular" label */}
                {plan.isPopular && (
                  <p className="is-popular">
                    Most popular
                  </p>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.amount}
                  </span>
                  <span className="ml-1 text-xl font-semibold">
                    /{plan.interval}
                  </span>
                </p>
                <p className="mt-6">{plan.description}</p>
                <ul role="list" className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 w-6 h-6 text-emerald-500"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>
                </div>

                <button
                className={`${
                    plan.interval === "month"
                    ? "bg-emerald-500 text-white  hover:bg-emerald-600 "
                    : "bg-emerald-100 text-emerald-700  hover:bg-emerald-200 "
                }  subscrib-button`}
                
                onClick={() => mutate({planType: plan.interval})}
                disabled={isPending}
                >
                    {isPending ? "Subscribing...please wait" : `Subscribe ${plan.name}`}
                </button>
                </div>
                ))}

        </div>
      </div>
    </div>
  );
}

