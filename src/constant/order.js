export const OrderStatusIcon = {
  // PENDING: "<HiCurrencyBangladeshi />",
  // CONFIRMED: <FaMoneyCheckAlt />,
  // IN_PROCESS: <TbTruckReturn />,
  // READY_FOR_PICKUP: <FaHandHoldingUsd />,
  // SHIPPED: <GiProgression />,
  // DELIVERED: <TbTruckDelivery />,
  // CANCEL: <BsCartXFill />,
};
export const OrderStatus = {
  PENDING: "pending",
  READY_FOR_PICKUP: "readyForPickup",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELED: "canceled",
};
export const orderStatusColor = (status) => {
  switch (status) {
    // case "pending":
    //   return "#fec53d"; // New color for pending (Gold)
    case "confirmed":
      return "#4BB543"; // New color for confirmed (Lime Green)
    case "inProcess":
      return "#16DBCC"; // Orange
    // case "ready For Pickup":
    //   return "#047AC8"; // Blue
    case "shipped":
      return "#800080"; // Purple
    case "delivered":
      return "#008000"; // Green
    case "canceled":
      return "#FF0000"; // Red
    default:
      return "#000000"; // Black
  }
};

export const calculateDeliveryPayment = (products) => {
  const insideDhaka = products.map((product) => product?.product?.delivery?.insideDhaka);

  const totalInsideDhaka = insideDhaka.reduce((acc, curr) => acc + curr, 0);
  const insideDhakaAvg = totalInsideDhaka / insideDhaka.length;
  const outSideDhaka = products.map((product) => product?.product?.delivery?.outsideDhaka);
  const totalOutsideDhaka = outSideDhaka.reduce((acc, curr) => acc + curr, 0);
  const outSideDhakaAvg = totalOutsideDhaka / outSideDhaka.length;
  return {
    insideDhaka: insideDhakaAvg,
    outsideDhaka: outSideDhakaAvg,
  };
};
