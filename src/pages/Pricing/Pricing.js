import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import usePremiumStatus from "../../hooks/usePremiumStatus";
import { stripe } from "../../utilis/initializeStripe";
import PricingPlan from "../../components/Pricing/PricingPlan";
import useUserCurrency from "../../hooks/useUserCurrency";
import { UserIPinfoContext } from "../../context/UserCurrencyContext";

const StripePricingTable = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [monthlySelected, setMonthlySelected] = useState(true);
  const [products, setProducts] = useState({ month: [], year: [] });
  const { ipInfo } = useContext(UserIPinfoContext);
  const [userCurrency, setUserCurrency] = useState(
    ipInfo.country == "IN" ? "inr" : "usd"
  );
  useEffect(() => {
    setUserCurrency(ipInfo.country == "IN" ? "inr" : "usd");
  }, [ipInfo]);

  const currentPlan = usePremiumStatus(user);
  const [productsLoading, setProductsLoading] = useState();
  const getProducts = async (currentPlan) => {
    setProductsLoading(true);
    const { data } = await stripe.products.list({ active: true });
    const products = {};

    await Promise.all(
      data.map(async (product) => {
        const { data: prices } = await stripe.prices.list({
          product: product.id,
          active: true,
          currency: userCurrency,
        });
        prices.map((price) => {
          if (price.recurring) {
            if (!products[price.recurring.interval]) {
              products[price.recurring.interval] = [];
            }
            products[price.recurring.interval].push({
              features: product.features,
              highlighted: product.metadata.highlighted,
              livemode: price.metadata.livemode,
              interval: price.recurring.interval,
              planName: product.name,
              priceId: price.id,
              productId: product.id,
              amount: price.unit_amount / 100,
              currencySymbol: price.currency,
            });
          }
        });
      })
    );
    setProducts(products);
    if (!currentPlan.loading) {
      setProductsLoading(false);
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);
    const script2 = document.createElement("script");
    script2.src =
      "https://js.stripe.com/v3/fingerprinted/js/pricing-table-loading-f01577d5bef4e1cdbc2790c53f008b79.js";
    script2.async = true;
    document.body.appendChild(script2);
    const script3 = document.createElement("script");
    script3.src =
      "https://js.stripe.com/v3/fingerprinted/js/stripe-5fe0c30c536947c20eafbef360ab79d3.js";

    script3.async = true;
    document.body.appendChild(script3);

    // setUserCurrency(currency);
    try {
      getProducts(currentPlan);
    } catch (error) {
      console.log(error);
    }
  }, [currentPlan]);
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
  const generateCustomerBillingPortalLink = async (stripeCustomerId) => {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${window.location.origin}/#/pricing`,
    });
    return portalSession.url;
  };
  if (productsLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          // placeContent: "center",
          display: "flex",
          // gridAutoFlow: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgb(254, 237, 221)",
        }}
      >
        <link
          rel="stylesheet"
          type="text/css"
          href="https://js.stripe.com/v3/fingerprinted/css/icon-2164909f61112d056505d20036bd32fc.css"
        />
        <link
          href="https://js.stripe.com/v3/fingerprinted/css/pricing-table-app-cc1ff4de30c57e81b67e982d59b34331.css"
          rel="stylesheet"
        ></link>
        <div className="loader-w"></div>
      </div>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        placeContent: "stretch",
        display: "grid",
        gridAutoFlow: "row",
        backgroundColor: "rgb(254, 237, 221)",
      }}
    >
      <link
        rel="stylesheet"
        type="text/css"
        href="https://js.stripe.com/v3/fingerprinted/css/icon-2164909f61112d056505d20036bd32fc.css"
      />
      <link
        href="https://js.stripe.com/v3/fingerprinted/css/pricing-table-app-cc1ff4de30c57e81b67e982d59b34331.css"
        rel="stylesheet"
      ></link>
      <div
        // style={{
        //   backgroundColor: "#1a1a1a0d",
        //   border: "1px solid rgba(26, 26, 26, 0.1)",
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "space-between",
        //   flexDirection: "row",
        //   borderRadius: "10px",
        //   padding: "10px",
        //   margin: "11px",
        // }}
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: "20px",
        }}
      >
        {/* <div
          style={{
            display: "flex",
            fontWeight: 500,
            fontSize: "16px",
            flexDirection: "column",
          }}
        >
          <div>
            Current Plan :{" "}
            <span style={{ fontWeight: 600, fontSize: "20px" }}>
              {currentPlan.name}{" "}
              {!currentPlan.loading &&
                `(${
                  currentPlan.requestLimit - user.userChatRequestCount || 'No'
                } AI chat requests left)`}
            </span>
          </div>
          {currentPlan.expiryDate && (
            <div style={{ paddingTop: "5px" }}>
              Expiring on : <span>{currentPlan.expiryDate.toDateString()}</span>
            </div>
          )}
        </div> */}
        <div>
          <button
            className="Button Button--primary Button--md"
            type="button"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                const link = await generateCustomerBillingPortalLink(
                  user.stripeId
                );
                window.location.assign(link);
                setLoading(false);
              } catch (error) {
                console.log(error);
              }
            }}
            style={{
              backgroundColor: "rgb(255, 122, 0)",
              borderColor: "rgb(255, 122, 0)",
            }}
          >
            <div className="flex-container justify-content-center align-items-center">
              <span className="Text Text-color--default Text-fontWeight--500">
                {loading ? <div className="loader"></div> : "Manage"}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div
        className="PricingTable is-whiteButtonText is-lightColorBackground flex-container direction-column justify-content-center align-items-center"
        data-testid="pricing-table-container"
        style={{
          "--pt-color-primary": "#ff7a00",
          backgroundColor: "rgb(254, 237, 221)",
        }}
      >
        <div className="IntervalTabs-refContainer">
          <div className="Tabs IntervalTabs is-insettabs is-desktop">
            <div className="Tabs-Container">
              <div
                role="tablist"
                aria-orientation="horizontal"
                aria-label="Billing intervals"
                className="Tabs-TabList"
              >
                <div
                  role="presentation"
                  className={`Tabs-TabListItemContainer ${
                    monthlySelected && "Tabs-TabListItemContainer--is-selected"
                  }`}
                >
                  <button
                    className={`Tabs-TabListItem ${
                      monthlySelected && "Tabs-TabListItem--is-selected"
                    }`}
                    id="1-month-tab"
                    data-testid="1-month-tab-button"
                    role="tab"
                    type="button"
                    aria-controls="1-month-tab-panel"
                    aria-label="Monthly"
                    aria-selected={`${monthlySelected}`}
                    tabIndex={0}
                    title="Monthly"
                    onClick={() => {
                      !monthlySelected && setMonthlySelected(true);
                    }}
                  >
                    <div className="Tabs-TabListItemContent">
                      <div className="Tabs-TabListPaymentMethod">
                        <div
                          className="Tabs-TabListPaymentLabel"
                          data-text="Monthly"
                        >
                          Monthly
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                <div
                  role="presentation"
                  className={`Tabs-TabListItemContainer ${
                    !monthlySelected && "Tabs-TabListItemContainer--is-selected"
                  }`}
                >
                  <button
                    className={`Tabs-TabListItem ${
                      !monthlySelected && "Tabs-TabListItem--is-selected"
                    }`}
                    id="1-year-tab"
                    data-testid="1-year-tab-button"
                    role="tab"
                    type="button"
                    aria-controls="1-year-tab-panel"
                    aria-label="Yearly"
                    aria-selected={`${!monthlySelected}`}
                    tabIndex={-1}
                    title="Yearly"
                    onClick={() => {
                      monthlySelected && setMonthlySelected(false);
                    }}
                  >
                    <div className="Tabs-TabListItemContent">
                      <div className="Tabs-TabListPaymentMethod">
                        <div
                          className="Tabs-TabListPaymentLabel"
                          data-text="Yearly"
                        >
                          Yearly
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                <span
                  className="IntervalTabs-glider"
                  style={{
                    backgroundColor: "rgb(255, 122, 0)",
                    "--offset": monthlySelected ? "2px" : "119px",
                    height: "36px",
                    width: monthlySelected ? "117px" : "100px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="PricingTable-grid">
          {monthlySelected ? (
            <>
              <PricingPlan
                order={0}
                plan={{
                  priceId: "price_1Nt9oTBqorTr3f3yqckB7Wox",
                  productId: "free",
                  highlighted: false,
                  livemode: false,
                  planName: "Free",
                  currencySymbol: userCurrency.toUpperCase(),
                  amount: 0,
                  interval: "month",
                  features: [
                    { name: "Access to our GPT-3.5 model" },
                    { name: "Standard response speed" },
                    {
                      name: "Regular model updates",
                    },
                  ],
                }}
              />
              {products.month
                ?.sort(({ amount: a }, { amount: b }) =>
                  a < b ? -1 : a > b ? 1 : 0
                )
                .map((p, index) => (
                  <PricingPlan key={index + 1} order={index + 1} plan={p} />
                ))}
            </>
          ) : (
            <>
              <PricingPlan
                order={0}
                plan={{
                  priceId: "price_1Nt9oTBqorTr3f3yqckB7Wox",
                  productId: "free",
                  highlighted: false,
                  livemode: false,
                  planName: "Free",
                  currencySymbol: userCurrency.toUpperCase(),
                  amount: 0,
                  interval: "year",
                  features: [
                    { name: "Access to our GPT-3.5 model" },
                    { name: "Standard response speed" },
                    {
                      name: "Regular model updates",
                    },
                  ],
                }}
              />
              {products.year
                ?.sort(({ amount: a }, { amount: b }) =>
                  a < b ? -1 : a > b ? 1 : 0
                )
                .map((p, index) => (
                  <PricingPlan key={index} order={index + 1} plan={p} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePricingTable;
