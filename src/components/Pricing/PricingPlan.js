import React, { useEffect, useState } from "react";
import { createCheckoutSession } from "../../utilis/createCheckoutSession";
import { useAuth } from "../../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import usePremiumStatus from "../../hooks/usePremiumStatus";

const PricingPlan = ({
  order = 1,
  plan = {
    priceId: "price_1Nt9oTBqorTr3f3yqckB7Wox",
    productId: "prod_Oi09cS9TB8NjvG",
    highlighted: true,
    livemode: false,
    planName: "Premium Plan",
    currencySymbol: "",
    amount: 200,
    interval: "month",
    features: [
      { name: "Access to GPT-4, our most capable model" },
      { name: "Faster response speed" },
      {
        name: "Exclusive access to features like Plugins and Advanced Data Analysis",
      },
    ],
  },
}) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const currentPlan = usePremiumStatus(user);
  console.log(currentPlan, plan);
  useEffect(() => {
    const getUser = () => {
      const starCountRef = doc(db, `users/${currentUser.uid}`);
      onSnapshot(starCountRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUser(data);
        }
      });
    };
    getUser();
  }, []);
  return (
    <div
      className={`PriceColumn flex-container direction-column justify-content-flex-start align-items-center ${
        plan.highlighted && "is-highlight"
      }`}
      data-testid="price-column"
      style={{ "--pt-animate-in-order": order }}
    >
      <div className="PriceColumn-content flex-container direction-column justify-content-flex-start align-items-center">
        <div className="PriceColumn-aboutProduct flex-container direction-column">
          {(plan.highlighted || !plan.livemode) && (
            <div className="PriceColumn-badge flex-container">
              {plan.highlighted && (
                <div className="Badge is-highlightBadge flex-container align-items-center">
                  <span className="Badge-text Text Text-color--default Text-fontSize--12 Text-fontWeight--500">
                    Recommended
                  </span>
                </div>
              )}
              {!plan.livemode && (
                <div style={{ marginLeft: plan.highlighted ? "10px" : "0px" }}>
                  <div className="Badge is-testModeBadge flex-container align-items-center">
                    <span className="Badge-text Text Text-color--default Text-fontSize--12 Text-fontWeight--500">
                      Test Mode
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="PriceColumn-textAndProductImage flex-container">
            <div
              className="PriceColumn-textContainerHeightAligner"
              style={{ height: "35px" }}
            >
              <div className="PriceColumn-textContainer flex-container direction-column">
                <div className="PriceColumn-name flex-container">
                  <span className="Text Text-color--default Text-fontSize--20 Text-fontWeight--600">
                    {plan.planName}
                  </span>
                </div>
                <span className="PriceColumn-description Text Text-color--default Text-fontSize--14" />
              </div>
            </div>
          </div>
        </div>
        <div className="PriceColumn-priceAndButton flex-container direction-column">
          <div
            className="PriceColumn-priceContainerHeightAligner"
            style={{ height: "45px" }}
          >
            <div className="PriceColumn-priceContainer">
              <div className="flex-container spacing-4 direction-column align-items-flex-start">
                <div className="flex-container align-items-center">
                  <span className="PriceColumn-price Text Text-color--default Text-fontSize--36 Text-fontWeight--700">
                    <span>{`${plan.currencySymbol.toUpperCase()} ${
                      plan.amount
                    }`}</span>
                  </span>
                  <span className="PriceColumn-interval Text Text-color--default Text-fontSize--13">
                    per <br />
                    {plan.interval}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            className="Button PriceColumn-button Button--primary Button--lg"
            type="button"
            disabled={
              plan.productId === currentPlan.productId ||
              plan.productId === "free"
            }
            onClick={async () => {
              setIsLoading(true);
              await createCheckoutSession(user.id, plan.priceId);
              //   setIsLoading(false);
            }}
            style={{
              backgroundColor:
                plan.priceId === currentPlan.id ? "" : "rgb(255, 122, 0)",
              borderColor: "rgb(255, 122, 0)",
              cursor:
                plan.productId === currentPlan.productId ||
                plan.productId === "free"
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <div className="flex-container justify-content-center align-items-center">
              <span className="Text Text-color--default Text-fontWeight--500 Text--truncate">
                {isLoading ? (
                  <div className="loader"></div>
                ) : plan.productId === currentPlan.productId ? (
                  "Current Plan"
                ) : (
                  "Subscribe"
                )}
              </span>
            </div>
          </button>
        </div>
      </div>
      <div className="PriceColumn-featureListContainer flex-container direction-column">
        <span className="PriceColumn-featureListHeader Text Text-color--default Text-fontSize--14">
          This includes:
        </span>

        <div className="PriceColumn-featureList flex-container direction-column align-items-flex-start">
          {plan.features.map((feature) => (
            <div className="PriceColumn-feature flex-container align-items-flex-start">
              <div className="PriceColumn-checkContainer flex-container">
                <svg
                  className="InlineSVG Icon PriceColumn-check Icon--sm"
                  focusable="false"
                  fill="#1a1a1a"
                  color="#1a1a1a"
                  fillOpacity="0.5"
                  height={16}
                  viewBox="0 0 16 16"
                  width={16}
                >
                  <path
                    d="m8 16c-4.418278 0-8-3.581722-8-8s3.581722-8 8-8 8 3.581722 8 8-3.581722 8-8 8zm3.0832728-11.00479172-4.0832728 4.09057816-1.79289322-1.79289322c-.39052429-.39052429-1.02368927-.39052429-1.41421356 0s-.39052429 1.02368927 0 1.41421356l2.5 2.50000002c.39052429.3905243 1.02368927.3905243 1.41421356 0l4.79037962-4.79768495c.3905243-.3905243.3905243-1.02368927 0-1.41421357-.3905243-.39052429-1.0236893-.39052429-1.4142136 0z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <span className="PriceColumn-featureText Text Text-color--default Text-fontSize--14">
                {feature.name}
              </span>
            </div>
          ))}
        </div>
        {plan.productId === currentPlan.productId && currentPlan.expiryDate && (
          <div style={{ paddingTop: "2px", fontSize: "10px" }}>
            *Expiring on <span>{currentPlan.expiryDate.toDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPlan;
