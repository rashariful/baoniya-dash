import { useMediaQuery } from "react-responsive";

const ResponsivHelper = () => {
  const isSmall = useMediaQuery({ query: "(max-width: 767px)" });
  const isMedium = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isLarge = useMediaQuery({ query: "(min-width: 1024px)" });

  return {
    isSmall,
    isMedium,
    isLarge,
  };
};

export default ResponsivHelper;
