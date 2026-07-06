export const formatAdvancedOrderTime = (createdAt: string) => {
  const now = new Date();
  const date = new Date(createdAt);

  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24 && now.getDate() === date.getDate())
    return date.toLocaleTimeString("en-US", timeOptions); // Today, show time
  if (days === 1 || (days < 2 && now.getDate() !== date.getDate()))
    return `Yest, ${date.toLocaleTimeString("en-US", timeOptions)}`;
  if (days < 7)
    return `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${date.toLocaleTimeString(
      "en-US",
      timeOptions
    )}`;
  
  // Older than a week
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + `, ${date.toLocaleTimeString("en-US", timeOptions)}`;
};
