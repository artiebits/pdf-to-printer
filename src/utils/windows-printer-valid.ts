import { Printer } from "../get-default-printer/get-default-printer";

export default function isValidPrinter(printer: string): {
  isValid: boolean;
  printerData: Printer;
} {
  const printerData: Printer = {
    deviceId: "",
    name: "",
  };

  const isValid = printer.split(/\r?\n/).some((line) => {
    const [label, value] = line.split(":").map((el) => el.trim());

    const lowerLabel = label.toLowerCase();

    // @ts-ignore
    if (lowerLabel === "deviceid") printerData.deviceId = value;

    // @ts-ignore
    if (lowerLabel === "name") printerData.name = value;

    return !!(printerData.deviceId && printerData.name);
  });

  return {
    isValid,
    printerData,
  };
}
