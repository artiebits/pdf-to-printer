import { defaultProperties, Printer } from "../index";

export default function isValidPrinter(
  printer: string,
  properties = defaultProperties
): {
  isValid: boolean;
  printerData: Printer;
} {
  const printerData: Printer = {
    deviceId: "",
    name: "",
  };

  printer.split(/\r?\n/).forEach((line) => {
    let [label, value] = line.split(":").map((el) => el.trim());

    // handle array dots
    if (value.match(/^{(.*)(\.{3})}$/)) {
      value = value.replace("...}", "}");
    }

    // handle array returns
    const matches = value.match(/^{(.*)}$/);

    if (matches && matches[1]) {
      // @ts-ignore
      value = matches[1].split(", ");
    }

    const lowerLabel = label.toLowerCase();
    const key = properties.find((prop) => prop.toLowerCase() === lowerLabel);

    if (!value.length) return;

    if (key === undefined) return;

    // @ts-ignore
    printerData[key] = value;
  });

  const isValid = !!(printerData.deviceId && printerData.name);

  return {
    isValid,
    printerData,
  };
}
