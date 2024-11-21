export const renderValue = (value: string | number) => {
  return value!=="NA" && value!==0 ? value : <span className="text-red-500">NA</span>;
}