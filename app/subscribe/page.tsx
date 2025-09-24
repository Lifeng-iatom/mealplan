import SubscriptionCard from '@/components/SubscriptionCard';
import React from 'react'

export default function Subscribe () {
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
        <SubscriptionCard />
      </div>
    </div>
  );
}

