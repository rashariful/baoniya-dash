  const convertToEnglishNumber = (banglaNumber) => {
    const banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
  
    return String(banglaNumber)
      .split('')
      .map(char => {
        const index = banglaDigits.indexOf(char);
        return index > -1 ? englishDigits[index] : char;
      })
      .join('');
  };

  export default convertToEnglishNumber;