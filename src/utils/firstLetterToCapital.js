const firstLetterToCapital = (str) => {
  if (!str) return null;

  const updatedStr = str
    .split(" ")
    ?.map((word) => {
      return word?.charAt(0)?.toUpperCase() + word?.slice(1);
    })
    ?.join(" ");

  return updatedStr;
};

export default firstLetterToCapital;
