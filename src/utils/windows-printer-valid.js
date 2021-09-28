module.exports = function isValidPrinter(printer) {
  const printerData = {
    deviceId: null,
    name: null,
  };

  const isValid = printer.split(/\r?\n/).some((line) => {
    const [label, value] = line.split(":").map((el) => el.trim());

    const lowerLabel = label.toLowerCase();

    if (lowerLabel === "deviceid") printerData.deviceId = value;

    if (lowerLabel === "name") printerData.name = value;

    return !!(printerData.deviceId && printerData.name);
  });

  return {
    isValid,
    printerData,
  };
};
