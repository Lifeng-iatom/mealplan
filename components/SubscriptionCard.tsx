import { availablePlans } from "@/lib/plan";





export default function SubscriptionCard(){
    return (
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
                
                >
                    Subscribe {plan.name}
                </button>
                </div>
                ))}

        </div>
    )
}