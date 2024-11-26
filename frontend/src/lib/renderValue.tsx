import dayjs from "dayjs";

export const renderValue = (value: string | number | Date, { type, size=50 }: { type?: "date" | "time" | "money" ; size?: number } = {}) => {

  if(value === null || value === undefined ||value === "NA" || value === -1){
    return <span className="text-red-500">NA</span>;
  }

  if (type === "date") {
    return dayjs(new Date(value)).format("DD-MM-YYYY");
  }

  if(type === "time"){
    return dayjs(new Date(value)).format("hh:mm A");
  }

  if(type === "money" && typeof value === "number"){
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  }

  const valueString = value.toString();
  const truncatedValue = valueString.length > size ? `${valueString.slice(0, size-3)}...` : valueString;

  return truncatedValue;
};
