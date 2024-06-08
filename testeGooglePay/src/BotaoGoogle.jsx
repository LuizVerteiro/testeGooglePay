import { useEffect } from "react";

function GooglePay() {
  useEffect(() => {
    const initializeGooglePay = () => {
      const baseRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
      };

      const tokenizationSpecification = {
        type: "PAYMENT_GATEWAY",
        parameters: {
          gateway: "example",
          gatewayMerchantId: "exampleGatewayMerchantId",
        },
      };

      const allowedCardNetworks = [
        "AMEX",
        "DISCOVER",
        "INTERAC",
        "JCB",
        "MASTERCARD",
        "VISA",
      ];

      const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

      const baseCardPaymentMethod = {
        type: "CARD",
        parameters: {
          allowedAuthMethods: allowedCardAuthMethods,
          allowedCardNetworks: allowedCardNetworks,
        },
      };

      const cardPaymentMethod = {
        ...baseCardPaymentMethod,
        tokenizationSpecification: tokenizationSpecification,
      };

      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: "TEST",
      });

      const isReadyToPayRequest = {
        ...baseRequest,
        allowedPaymentMethods: [baseCardPaymentMethod],
      };

      paymentsClient
        .isReadyToPay(isReadyToPayRequest)
        .then(function (response) {
          if (response.result) {
            if (!document.getElementById("google-pay-button")) {
              const button = paymentsClient.createButton({
                onClick: () => onGooglePayButtonClick(paymentsClient),
                allowedPaymentMethods: [cardPaymentMethod],
              });
              button.id = "google-pay-button";
              document.getElementById("container").appendChild(button);
            }
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    };

    const onGooglePayButtonClick = (paymentsClient) => {
      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: [
                "AMEX",
                "DISCOVER",
                "INTERAC",
                "JCB",
                "MASTERCARD",
                "VISA",
              ],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleGatewayMerchantId",
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: "123",
          currencyCode: "BRL",
          countryCode: "BR",
        },
        merchantInfo: {
          merchantName: "Example Merchant",
          merchantId: "12345678901234567890",
        },
      };

      paymentsClient
        .loadPaymentData(paymentDataRequest)
        .then(function (paymentData) {
          const paymentToken =
            paymentData.paymentMethodData.tokenizationData.token;
          console.log(paymentToken); 
        })
        .catch(function (err) {
          console.error(err);
        });
        paymentsClient.prefetchPaymentData(paymentDataRequest);
    };

    if (!window.google || !window.google.payments) {
      // Load Google Pay script
      const script = document.createElement("script");
      script.src = "https://pay.google.com/gp/p/js/pay.js";
      script.async = true;
      script.onload = initializeGooglePay;
      document.body.appendChild(script);
    } else {
      initializeGooglePay();
    }
  }, []);
  return <div id="container"></div>;
}

export default GooglePay;
