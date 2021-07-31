"use strict";

import execAsync from "../utils/exec-file-async";
import getDefaultPrinter from "./get-default-printer";
import getPrinters from "./get-printers";

jest.mock("../utils/exec-file-async");

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

const mockPrinterListStdout = `


Status                      :
Name                        : OneNote
Caption                     :
Description                 :
InstallDate                 :
Availability                :
ConfigManagerErrorCode      :
ConfigManagerUserConfig     :
CreationClassName           :
DeviceID                    : OneNote
ErrorCleared                :
ErrorDescription            :
LastErrorCode               :
PNPDeviceID                 :
PowerManagementCapabilities :
PowerManagementSupported    :
StatusInfo                  :
SystemCreationClassName     :
SystemName                  :
AvailableJobSheets          :
Capabilities                :
CapabilityDescriptions      :
CharSetsSupported           :
CurrentCapabilities         :
CurrentCharSet              :
CurrentLanguage             :
CurrentMimeType             :
CurrentNaturalLanguage      :
CurrentPaperType            :
DefaultCapabilities         :
DefaultCopies               :
DefaultLanguage             :
DefaultMimeType             :
DefaultNumberUp             :
DefaultPaperType            :
DetectedErrorState          :
ErrorInformation            :
HorizontalResolution        :
JobCountSinceLastReset      :
LanguagesSupported          :
MarkingTechnology           :
MaxCopies                   :
MaxNumberUp                 :
MaxSizeSupported            :
MimeTypesSupported          :
NaturalLanguagesSupported   :
PaperSizesSupported         :
PaperTypesAvailable         :
PrinterStatus               :
TimeOfLastReset             :
VerticalResolution          :
Attributes                  :
AveragePagesPerMinute       :
Comment                     :
Default                     :
DefaultPriority             :
Direct                      :
DoCompleteFirst             :
DriverName                  :
EnableBIDI                  :
EnableDevQueryPrint         :
ExtendedDetectedErrorState  :
ExtendedPrinterStatus       :
Hidden                      :
KeepPrintedJobs             :
Local                       :
Location                    :
Network                     :
Parameters                  :
PortName                    :
PrinterPaperNames           :
PrinterState                :
PrintJobDataType            :
PrintProcessor              :
Priority                    :
Published                   :
Queued                      :
RawOnly                     :
SeparatorFile               :
ServerName                  :
Shared                      :
ShareName                   :
SpoolEnabled                :
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






Status                      :
Name                        : Microsoft XPS Document Writer
Caption                     :
Description                 :
InstallDate                 :
Availability                :
ConfigManagerErrorCode      :
ConfigManagerUserConfig     :
CreationClassName           :
DeviceID                    : Microsoft XPS Document Writer
ErrorCleared                :
ErrorDescription            :
LastErrorCode               :
PNPDeviceID                 :
PowerManagementCapabilities :
PowerManagementSupported    :
StatusInfo                  :
SystemCreationClassName     :
SystemName                  :
AvailableJobSheets          :
Capabilities                :
CapabilityDescriptions      :
CharSetsSupported           :
CurrentCapabilities         :
CurrentCharSet              :
CurrentLanguage             :
CurrentMimeType             :
CurrentNaturalLanguage      :
CurrentPaperType            :
DefaultCapabilities         :
DefaultCopies               :
DefaultLanguage             :
DefaultMimeType             :
DefaultNumberUp             :
DefaultPaperType            :
DetectedErrorState          :
ErrorInformation            :
HorizontalResolution        :
JobCountSinceLastReset      :
LanguagesSupported          :
MarkingTechnology           :
MaxCopies                   :
MaxNumberUp                 :
MaxSizeSupported            :
MimeTypesSupported          :
NaturalLanguagesSupported   :
PaperSizesSupported         :
PaperTypesAvailable         :
PrinterStatus               :
TimeOfLastReset             :
VerticalResolution          :
Attributes                  :
AveragePagesPerMinute       :
Comment                     :
Default                     :
DefaultPriority             :
Direct                      :
DoCompleteFirst             :
DriverName                  :
EnableBIDI                  :
EnableDevQueryPrint         :
ExtendedDetectedErrorState  :
ExtendedPrinterStatus       :
Hidden                      :
KeepPrintedJobs             :
Local                       :
Location                    :
Network                     :
Parameters                  :
PortName                    :
PrinterPaperNames           :
PrinterState                :
PrintJobDataType            :
PrintProcessor              :
Priority                    :
Published                   :
Queued                      :
RawOnly                     :
SeparatorFile               :
ServerName                  :
Shared                      :
ShareName                   :
SpoolEnabled                :
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






Status                      :
Name                        : Microsoft Print to PDF
Caption                     :
Description                 :
InstallDate                 :
Availability                :
ConfigManagerErrorCode      :
ConfigManagerUserConfig     :
CreationClassName           :
DeviceID                    : Microsoft Print to PDF
ErrorCleared                :
ErrorDescription            :
LastErrorCode               :
PNPDeviceID                 :
PowerManagementCapabilities :
PowerManagementSupported    :
StatusInfo                  :
SystemCreationClassName     :
SystemName                  :
AvailableJobSheets          :
Capabilities                :
CapabilityDescriptions      :
CharSetsSupported           :
CurrentCapabilities         :
CurrentCharSet              :
CurrentLanguage             :
CurrentMimeType             :
CurrentNaturalLanguage      :
CurrentPaperType            :
DefaultCapabilities         :
DefaultCopies               :
DefaultLanguage             :
DefaultMimeType             :
DefaultNumberUp             :
DefaultPaperType            :
DetectedErrorState          :
ErrorInformation            :
HorizontalResolution        :
JobCountSinceLastReset      :
LanguagesSupported          :
MarkingTechnology           :
MaxCopies                   :
MaxNumberUp                 :
MaxSizeSupported            :
MimeTypesSupported          :
NaturalLanguagesSupported   :
PaperSizesSupported         :
PaperTypesAvailable         :
PrinterStatus               :
TimeOfLastReset             :
VerticalResolution          :
Attributes                  :
AveragePagesPerMinute       :
Comment                     :
Default                     :
DefaultPriority             :
Direct                      :
DoCompleteFirst             :
DriverName                  :
EnableBIDI                  :
EnableDevQueryPrint         :
ExtendedDetectedErrorState  :
ExtendedPrinterStatus       :
Hidden                      :
KeepPrintedJobs             :
Local                       :
Location                    :
Network                     :
Parameters                  :
PortName                    :
PrinterPaperNames           :
PrinterState                :
PrintJobDataType            :
PrintProcessor              :
Priority                    :
Published                   :
Queued                      :
RawOnly                     :
SeparatorFile               :
ServerName                  :
Shared                      :
ShareName                   :
SpoolEnabled                :
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






Status                      :
Name                        : Fax
Caption                     :
Description                 :
InstallDate                 :
Availability                :
ConfigManagerErrorCode      :
ConfigManagerUserConfig     :
CreationClassName           :
DeviceID                    : Fax
ErrorCleared                :
ErrorDescription            :
LastErrorCode               :
PNPDeviceID                 :
PowerManagementCapabilities :
PowerManagementSupported    :
StatusInfo                  :
SystemCreationClassName     :
SystemName                  :
AvailableJobSheets          :
Capabilities                :
CapabilityDescriptions      :
CharSetsSupported           :
CurrentCapabilities         :
CurrentCharSet              :
CurrentLanguage             :
CurrentMimeType             :
CurrentNaturalLanguage      :
CurrentPaperType            :
DefaultCapabilities         :
DefaultCopies               :
DefaultLanguage             :
DefaultMimeType             :
DefaultNumberUp             :
DefaultPaperType            :
DetectedErrorState          :
ErrorInformation            :
HorizontalResolution        :
JobCountSinceLastReset      :
LanguagesSupported          :
MarkingTechnology           :
MaxCopies                   :
MaxNumberUp                 :
MaxSizeSupported            :
MimeTypesSupported          :
NaturalLanguagesSupported   :
PaperSizesSupported         :
PaperTypesAvailable         :
PrinterStatus               :
TimeOfLastReset             :
VerticalResolution          :
Attributes                  :
AveragePagesPerMinute       :
Comment                     :
Default                     :
DefaultPriority             :
Direct                      :
DoCompleteFirst             :
DriverName                  :
EnableBIDI                  :
EnableDevQueryPrint         :
ExtendedDetectedErrorState  :
ExtendedPrinterStatus       :
Hidden                      :
KeepPrintedJobs             :
Local                       :
Location                    :
Network                     :
Parameters                  :
PortName                    :
PrinterPaperNames           :
PrinterState                :
PrintJobDataType            :
PrintProcessor              :
Priority                    :
Published                   :
Queued                      :
RawOnly                     :
SeparatorFile               :
ServerName                  :
Shared                      :
ShareName                   :
SpoolEnabled                :
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties







`;

const mockDefaultPrinterStdout = `


Status                      :
Name                        : Microsoft Print to PDF
Caption                     :
Description                 :
InstallDate                 :
Availability                :
ConfigManagerErrorCode      :
ConfigManagerUserConfig     :
CreationClassName           :
DeviceID                    : Microsoft Print to PDF
ErrorCleared                :
ErrorDescription            :
LastErrorCode               :
PNPDeviceID                 :
PowerManagementCapabilities :
PowerManagementSupported    :
StatusInfo                  :
SystemCreationClassName     :
SystemName                  :
AvailableJobSheets          :
Capabilities                :
CapabilityDescriptions      :
CharSetsSupported           :
CurrentCapabilities         :
CurrentCharSet              :
CurrentLanguage             :
CurrentMimeType             :
CurrentNaturalLanguage      :
CurrentPaperType            :
DefaultCapabilities         :
DefaultCopies               :
DefaultLanguage             :
DefaultMimeType             :
DefaultNumberUp             :
DefaultPaperType            :
DetectedErrorState          :
ErrorInformation            :
HorizontalResolution        :
JobCountSinceLastReset      :
LanguagesSupported          :
MarkingTechnology           :
MaxCopies                   :
MaxNumberUp                 :
MaxSizeSupported            :
MimeTypesSupported          :
NaturalLanguagesSupported   :
PaperSizesSupported         :
PaperTypesAvailable         :
PrinterStatus               :
TimeOfLastReset             :
VerticalResolution          :
Attributes                  :
AveragePagesPerMinute       :
Comment                     :
Default                     :
DefaultPriority             :
Direct                      :
DoCompleteFirst             :
DriverName                  :
EnableBIDI                  :
EnableDevQueryPrint         :
ExtendedDetectedErrorState  :
ExtendedPrinterStatus       :
Hidden                      :
KeepPrintedJobs             :
Local                       :
Location                    :
Network                     :
Parameters                  :
PortName                    :
PrinterPaperNames           :
PrinterState                :
PrintJobDataType            :
PrintProcessor              :
Priority                    :
Published                   :
Queued                      :
RawOnly                     :
SeparatorFile               :
ServerName                  :
Shared                      :
ShareName                   :
SpoolEnabled                :
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties







`;

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockPrinterListStdout))
  );
  // We do not expect "Name" to be in the result because
  // Windows will write to stdout a list of printers under "Name" title.
  return expect(getPrinters()).resolves.toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft XPS Document Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft Print to PDF",
      name: "Microsoft Print to PDF",
    },
    {
      deviceId: "Fax",
      name: "Fax",
    },
  ]);
});

test("gets the default printer", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockDefaultPrinterStdout))
  );
  // We do not expect "Name" to be in the result because
  // Windows will write to stdout a list of printers under "Name" title.
  return expect(getDefaultPrinter()).resolves.toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
  });
});

test("test no default printer defined", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(""))
  );
  return expect(getDefaultPrinter()).resolves.toStrictEqual(null);
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(getPrinters()).rejects.toBe("error");
});
