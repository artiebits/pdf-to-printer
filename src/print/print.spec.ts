import { existsSync } from "fs";
import { join } from "path";
import { mocked } from "ts-jest/utils";
import execAsync from "../utils/exec-file-async";
import fixPathForAsarUnpack from "../utils/electron-util";
import print from "./print";

jest.mock("fs");
jest.mock("path");
jest.mock("../utils/exec-file-async");
jest.mock("../utils/electron-util");
jest.mock("../utils/throw-if-unsupported-os");
const mockedFixPathForAsarUnpack = mocked(fixPathForAsarUnpack);
const mockedExistsSync = mocked(existsSync);
const mockedExecAsync = mocked(execAsync);
const mockedJoin = mocked(join);

beforeEach(() => {
  // override the implementations
  mockedFixPathForAsarUnpack.mockImplementation((path) => path);
  mockedExistsSync.mockImplementation(() => true);
  mockedExecAsync.mockResolvedValue({ stdout: "", stderr: "" });
  mockedJoin.mockImplementation((_, filename) => "mocked_path_" + filename);
});

afterEach(() => {
  // restore the original implementations
  mockedFixPathForAsarUnpack.mockRestore();
  mockedExistsSync.mockRestore();
  mockedExecAsync.mockRestore();
  mockedJoin.mockRestore();
});

it("throws when no file is specified.", async () => {
  // @ts-ignore
  await expect(print()).rejects.toMatch("No PDF specified");
});

it("throws when file not found", async () => {
  mockedExistsSync.mockImplementation(() => false);

  await expect(print("file.txt")).rejects.toMatch("No such file");
});

it("sends the PDF file to the default printer", async () => {
  const filename = "assets/sample.pdf";

  await print(filename);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-to-default",
    "-silent",
    filename,
  ]);
});

it("sends PDF file to the specific printer", async () => {
  const filename = "assets/sample.pdf";
  const printer = "Zebra";
  const options = { printer };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-to",
    printer,
    "-silent",
    filename,
  ]);
});

it("sends PDF file to the specific printer with a space in its name", async () => {
  const filename = "assets/sample.pdf";
  const printer = "Microsoft Print to PDF";
  const options = { printer };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-to",
    printer,
    "-silent",
    filename,
  ]);
});

it("allows users to specify which pages to print in the document", async () => {
  const filename = "assets/sample.pdf";
  const options = { pages: "1,3" };
  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-to-default",
    "-silent",
    "-print-settings",
    "1,3",
    filename,
  ]);
});

describe("paper size", () => {
  [
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "letter",
    "legal",
    "tabloid",
    "statement",
  ].forEach((paperSize) => {
    it(`allows to set paper size to ${paperSize}`, async () => {
      const filename = "assets/sample.pdf";
      const options = { paperSize };

      await print(filename, options);

      expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
        "-print-to-default",
        "-silent",
        "-print-settings",
        `paper=${paperSize}`,
        filename,
      ]);
    });
  });

  it("throws when incorrect paper size provided", () => {
    const filename = "assets/sample.pdf";
    const options = {
      paperSize: "foo",
    };

    return expect(print(filename, options)).rejects.toBe(
      "Invalid paper size provided. Valid names: A2, A3, A4, A5, A6, letter, legal, tabloid, statement"
    );
  });
});

describe("orientation", () => {
  ["portrait", "landscape"].forEach((orientation) => {
    it("allows to specify orientation", async () => {
      const filename = "assets/sample.pdf";
      const options = { orientation };

      await print(filename, options);

      expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
        "-print-to-default",
        "-silent",
        "-print-settings",
        orientation,
        filename,
      ]);
    });
  });

  it("throws when incorrect orientation provided", () => {
    const filename = "assets/sample.pdf";
    const options = {
      orientation: "foo",
    };

    return expect(print(filename, options)).rejects.toBe(
      "Invalid orientation provided. Valid names: portrait, landscape"
    );
  });
});

describe("monochrome", () => {
  it("allows to print in black and white", async () => {
    const filename = "assets/sample.pdf";
    const options = {
      monochrome: true,
    };

    await print(filename, options);

    expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
      "-print-to-default",
      "-silent",
      "-print-settings",
      "monochrome",
      filename,
    ]);
  });

  it("allows to print in color", async () => {
    const filename = "assets/sample.pdf";
    const options = {
      monochrome: false,
    };

    await print(filename, options);

    expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
      "-print-to-default",
      "-silent",
      "-print-settings",
      "color",
      filename,
    ]);
  });
});

describe("subset", () => {
  ["odd", "even"].forEach((subset) => {
    it(`allows to print {subset} pages only`, async () => {
      const filename = "assets/sample.pdf";
      const options = {
        subset: "odd",
      };

      await print(filename, options);

      expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
        "-print-to-default",
        "-silent",
        "-print-settings",
        "odd",
        filename,
      ]);
    });
  });

  it("throws when incorrect subset provided", () => {
    const filename = "assets/sample.pdf";
    const options = {
      subset: "foo",
    };

    return expect(print(filename, options)).rejects.toBe(
      "Invalid subset provided. Valid names: odd, even"
    );
  });
});

describe("scale", () => {
  ["noscale", "shrink", "fit"].forEach((scale) => {
    it(`allows to set scale to ${scale}`, async () => {
      const filename = "assets/sample.pdf";
      const options = { scale };

      await print(filename, options);

      expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
        "-print-to-default",
        "-silent",
        "-print-settings",
        scale,
        filename,
      ]);
    });
  });

  it("throws when incorrect scale provided", () => {
    const filename = "assets/sample.pdf";
    const options = {
      scale: "foo",
    };

    return expect(print(filename, options)).rejects.toBe(
      "Invalid scale provided. Valid names: noscale, shrink, fit"
    );
  });
});

describe("side", () => {
  ["duplex", "duplexshort", "duplexlong", "simplex"].forEach((side) => {
    it(`allows to set side to ${side}`, async () => {
      const filename = "assets/sample.pdf";
      const options = { side };

      await print(filename, options);

      expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
        "-print-to-default",
        "-silent",
        "-print-settings",
        side,
        filename,
      ]);
    });
  });

  it("throws when incorrect side provided", () => {
    const filename = "assets/sample.pdf";
    const options = {
      side: "foo",
    };

    return expect(print(filename, options)).rejects.toBe(
      "Invalid side provided. Valid names: duplex, duplexshort, duplexlong, simplex"
    );
  });
});

describe("bin", () => {
  it("allows to select tray to print to", async () => {
    const filename = "assets/sample.pdf";
    const options = { bin: "1" };

    await print(filename, options);

    expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
      "-print-to-default",
      "-silent",
      "-print-settings",
      "bin=1",
      filename,
    ]);
  });
});

describe("copies", () => {
  it("file should be printed a specified amount of times", async () => {
    const filename = "assets/sample.pdf";
    const options = { copies: 3 };

    await print(filename, options);

    expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
      "-print-to-default",
      "-silent",
      "-print-settings",
      "3x",
      filename,
    ]);
  });
});

it("does not set a printer when printDialog is set to true", async () => {
  const filename = "assets/sample.pdf";
  const options = { printer: "Zebra", printDialog: true };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-dialog",
    filename,
  ]);
});

it("allows to turn on SumatraPDF error messages", async () => {
  const filename = "assets/sample.pdf";
  const options = { silent: false };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-to-default",
    filename,
  ]);
});

it("allows to set multiple print settings", async () => {
  const filename = "assets/sample.pdf";
  const options = {
    printer: "Zebra",
    pages: "1-3,5",
    subset: "odd",
    scale: "fit",
    bin: "2",
    paperSize: "A2",
  };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith("mocked_path_SumatraPDF.exe", [
    "-print-to",
    "Zebra",
    "-silent",
    "-print-settings",
    "1-3,5,odd,fit,bin=2,paper=A2",
    filename,
  ]);
});

it("works when custom SumatraPDF path specified", async () => {
  const mockedSumatraPdfPath = "mocked_SumatraPDF.exe";
  const filename = "assets/sample.pdf";

  await print(filename, { sumatraPdfPath: mockedSumatraPdfPath });

  expect(execAsync).toHaveBeenCalledWith(mockedSumatraPdfPath, [
    "-print-to-default",
    "-silent",
    filename,
  ]);
});

it("fails with an error", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(print("sample.pdf")).rejects.toBe("error");
});
