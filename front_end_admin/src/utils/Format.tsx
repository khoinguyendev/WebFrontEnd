import { SERVER_HOST } from "../configs/UrlServer";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
};

export const urlImage = (url: string): string => {
  if (url&&url.slice(0, 4) === "http") return url;
  return `${SERVER_HOST}/uploads/${url}`;
};
export const urlList = (url: string): string => {
  
  return JSON.parse(url)[0];
};