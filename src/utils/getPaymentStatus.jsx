import firstLetterToCapital from "./firstLetterToCapital";

const getPaymentStatus = (paymentStatus, orderStatus) => {
  const updatedPaymentStatus =
    ((orderStatus === "confirmed" || orderStatus === "canceled") &&
      paymentStatus === "paid") ||
    ((orderStatus === "confirmed" || orderStatus === "canceled") &&
      paymentStatus === "partial")
      ? "Unpaid"
      : firstLetterToCapital(paymentStatus);

  return updatedPaymentStatus;
};

export default getPaymentStatus;
