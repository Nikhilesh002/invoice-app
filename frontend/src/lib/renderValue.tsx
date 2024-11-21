export const renderValue = (value: string | number,size: number=50) => {
  if (value === "NA" || value === 0) {
    return <span className="text-red-500">NA</span>;
  }

  const valueString = value.toString();
  const truncatedValue = valueString.length > size ? `${valueString.slice(0, size-3)}...` : valueString;

  return truncatedValue;
};
