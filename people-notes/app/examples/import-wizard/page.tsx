"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Download,
} from "lucide-react";

export default function ContactImportWizard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileContent, setFileContent] = useState("");
  const [fileError, setFileError] = useState("");

  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState(0);

  const [fieldMappings, setFieldMappings] = useState<{ [key: string]: string }>(
    {}
  );
  const [availableFields] = useState([
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "notes",
  ]);
  const [mappingErrors, setMappingErrors] = useState<string[]>([]);

  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [validContacts, setValidContacts] = useState<any[]>([]);
  const [invalidContacts, setInvalidContacts] = useState<any[]>([]);
  const [validationProgress, setValidationProgress] = useState(0);

  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [duplicateResolutions, setDuplicateResolutions] = useState<{
    [key: string]: string;
  }>({});
  const [duplicateCheckProgress, setDuplicateCheckProgress] = useState(0);

  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const validateEmail = (email: string): string | null => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Invalid email format";
    }
    if (email.length > 100) {
      return "Email too long";
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone || phone.trim() === "") {
      return null; // Phone is optional
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return "Invalid phone format";
    }
    if (cleanPhone.length < 10) {
      return "Phone number too short";
    }
    return null;
  };

  const validateName = (name: string, fieldName: string): string | null => {
    if (!name || name.trim() === "") {
      return `${fieldName} is required`;
    }
    if (name.length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (name.length > 50) {
      return `${fieldName} is too long`;
    }
    if (!/^[a-zA-Z\s\-\'\.]+$/.test(name)) {
      return `${fieldName} contains invalid characters`;
    }
    return null;
  };

  const validateCompany = (company: string): string | null => {
    if (!company || company.trim() === "") {
      return null; // Company is optional
    }
    if (company.length > 100) {
      return "Company name is too long";
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFileError("");

    // File validation
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFileError("Please select a CSV file");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      setFileError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setCanProceed(true);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFileContent(content);
        parseCsvContent(content);
        setCurrentStep(2);
        setCanProceed(false);
        setIsLoading(false);
      };

      reader.onerror = () => {
        setFileError("Error reading file");
        setIsLoading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      setFileError("Failed to upload file");
      setIsLoading(false);
    }
  };

  const parseCsvContent = (content: string) => {
    try {
      const lines = content.split("\n").filter((line) => line.trim());
      if (lines.length === 0) {
        setParseErrors(["File is empty"]);
        return;
      }

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      setCsvHeaders(headers);

      const rows = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));

          if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: Column count mismatch`);
            continue;
          }

          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          row._rowNumber = i + 1;
          rows.push(row);
        } catch (error) {
          errors.push(`Row ${i + 1}: Parse error`);
        }
      }

      setCsvData(rows);
      setTotalRows(rows.length);
      setParseErrors(errors);

      if (rows.length > 0) {
        setCanProceed(true);
      }
    } catch (error) {
      setParseErrors(["Failed to parse CSV file"]);
    }
  };

  const handleFieldMapping = (csvField: string, appField: string) => {
    const newMappings = { ...fieldMappings };

    if (appField === "") {
      delete newMappings[csvField];
    } else {
      // Remove any existing mapping to this app field
      Object.keys(newMappings).forEach((key) => {
        if (newMappings[key] === appField) {
          delete newMappings[key];
        }
      });
      newMappings[csvField] = appField;
    }

    setFieldMappings(newMappings);
    validateMappings(newMappings);
  };

  const validateMappings = (mappings: { [key: string]: string }) => {
    const errors: string[] = [];
    const requiredFields = ["firstName", "lastName", "email"];

    requiredFields.forEach((field) => {
      const isMapped = Object.values(mappings).includes(field);
      if (!isMapped) {
        errors.push(`${field} must be mapped`);
      }
    });

    setMappingErrors(errors);
    setCanProceed(errors.length === 0);
  };

  const validateContacts = async () => {
    setIsLoading(true);
    setValidationProgress(0);

    const valid = [];
    const invalid = [];
    const results = [];

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const contact: any = {};
      const errors: string[] = [];

      // Map fields
      Object.keys(fieldMappings).forEach((csvField) => {
        const appField = fieldMappings[csvField];
        contact[appField] = row[csvField] || "";
      });

      const firstNameError = validateName(contact.firstName, "First name");
      if (firstNameError) errors.push(firstNameError);

      const lastNameError = validateName(contact.lastName, "Last name");
      if (lastNameError) errors.push(lastNameError);

      const emailError = validateEmail(contact.email);
      if (emailError) errors.push(emailError);

      const phoneError = validatePhone(contact.phone);
      if (phoneError) errors.push(phoneError);

      const companyError = validateCompany(contact.company);
      if (companyError) errors.push(companyError);

      const result = {
        ...contact,
        _rowNumber: row._rowNumber,
        _errors: errors,
        _isValid: errors.length === 0,
      };

      results.push(result);

      if (errors.length === 0) {
        valid.push(result);
      } else {
        invalid.push(result);
      }

      const progress = ((i + 1) / csvData.length) * 100;
      setValidationProgress(progress);

      // Simulate processing time
      if (i % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    setValidationResults(results);
    setValidContacts(valid);
    setInvalidContacts(invalid);
    setIsLoading(false);
    setCanProceed(valid.length > 0);
  };

  const findDuplicates = async () => {
    setIsLoading(true);
    setDuplicateCheckProgress(0);

    const duplicateGroups = [];
    const processed = new Set();

    for (let i = 0; i < validContacts.length; i++) {
      if (processed.has(i)) continue;

      const contact = validContacts[i];
      const duplicateGroup = [contact];

      for (let j = i + 1; j < validContacts.length; j++) {
        if (processed.has(j)) continue;

        const otherContact = validContacts[j];

        const emailMatch =
          contact.email.toLowerCase() === otherContact.email.toLowerCase();
        const nameMatch =
          contact.firstName.toLowerCase() ===
            otherContact.firstName.toLowerCase() &&
          contact.lastName.toLowerCase() ===
            otherContact.lastName.toLowerCase();

        if (emailMatch || nameMatch) {
          duplicateGroup.push(otherContact);
          processed.add(j);
        }
      }

      if (duplicateGroup.length > 1) {
        duplicateGroups.push(duplicateGroup);
      }

      processed.add(i);

      const progress = ((i + 1) / validContacts.length) * 100;
      setDuplicateCheckProgress(progress);

      // Simulate processing time
      if (i % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }

    setDuplicates(duplicateGroups);
    setIsLoading(false);
    setCanProceed(true);
  };

  const handleDuplicateResolution = (
    groupIndex: number,
    resolution: string,
    selectedContact?: any
  ) => {
    const newResolutions = { ...duplicateResolutions };
    newResolutions[groupIndex] = resolution;

    if (resolution === "keep_selected" && selectedContact) {
      newResolutions[`${groupIndex}_selected`] = selectedContact._rowNumber;
    }

    setDuplicateResolutions(newResolutions);
  };

  const performImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportErrors([]);

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    const contactsToImport: any[] = [];

    // Add non-duplicate contacts
    const duplicateContactIds = new Set();
    duplicates.forEach((group) => {
      group.forEach((contact: any) =>
        duplicateContactIds.add(contact._rowNumber)
      );
    });

    validContacts.forEach((contact) => {
      if (!duplicateContactIds.has(contact._rowNumber)) {
        contactsToImport.push(contact);
      }
    });

    // Add resolved duplicates
    duplicates.forEach((group, groupIndex) => {
      const resolution = duplicateResolutions[groupIndex];

      if (resolution === "import_all") {
        contactsToImport.push(...group);
      } else if (resolution === "import_first") {
        contactsToImport.push(group[0]);
      } else if (resolution === "keep_selected") {
        const selectedRowNumber =
          duplicateResolutions[`${groupIndex}_selected`];
        const selectedContact = group.find(
          (c: any) => c._rowNumber === selectedRowNumber
        );
        if (selectedContact) {
          contactsToImport.push(selectedContact);
        }
      }
      // 'skip_all' means don't add any from this group
    });

    // Import contacts
    for (let i = 0; i < contactsToImport.length; i++) {
      const contact = contactsToImport[i];

      try {
        const response = await fetch("/api/people", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone || "",
            company: contact.company || "",
            notes: contact.notes || "",
          }),
        });

        if (response.ok) {
          imported++;
        } else {
          const error = await response.json();
          errors.push(`Row ${contact._rowNumber}: ${error.message}`);
          skipped++;
        }
      } catch (error) {
        errors.push(`Row ${contact._rowNumber}: Import failed`);
        skipped++;
      }

      // Update progress
      const progress = ((i + 1) / contactsToImport.length) * 100;
      setImportProgress(progress);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setImportedCount(imported);
    setSkippedCount(skipped);
    setImportErrors(errors);
    setIsImporting(false);
    setImportComplete(true);
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      handleFileUpload();
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setCanProceed(false);
      validateContacts();
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setCanProceed(false);
      findDuplicates();
    } else if (currentStep === 4) {
      setCurrentStep(5);
      setCanProceed(false);
      performImport();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCanProceed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/dashboard" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Import Contacts
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* STEP INDICATOR (should be separate component) */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? "bg-blue-600 text-white"
                      : step < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Upload File</span>
            <span>Map Fields</span>
            <span>Validate</span>
            <span>Handle Duplicates</span>
            <span>Import</span>
          </div>
        </div>

        {/* STEP 1: FILE UPLOAD */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Choose a CSV file to import
                  </p>
                  <p className="text-gray-600 mb-4">
                    File should contain contact information with headers
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Select CSV File
                  </Button>
                </div>

                {file && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{file.name}</p>
                        <p className="text-sm text-blue-700">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {fileError && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-red-800">{fileError}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    CSV Format Requirements:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• First row should contain column headers</li>
                    <li>• Required fields: First Name, Last Name, Email</li>
                    <li>• Optional fields: Phone, Company, Notes</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: FIELD MAPPING */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Map CSV Fields</CardTitle>
              <p className="text-gray-600">
                Match your CSV columns to contact fields. Found {totalRows} rows
                to import.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {csvHeaders.map((header, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CSV Column: <span className="font-bold">{header}</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        Sample: {csvData[0]?.[header] || "No data"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <select
                        value={fieldMappings[header] || ""}
                        onChange={(e) =>
                          handleFieldMapping(header, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Don't import</option>
                        {availableFields.map((field) => (
                          <option key={field} value={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {mappingErrors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">
                      Mapping Errors:
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {mappingErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parseErrors.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Parse Warnings:
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {parseErrors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {parseErrors.length > 5 && (
                        <li>• ... and {parseErrors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: VALIDATION */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Validate Contact Data</CardTitle>
              <p className="text-gray-600">
                Checking data quality and format...
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Validating contacts...</span>
                    <span>{validationProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${validationProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium text-green-900">
                            Valid Contacts
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            {validContacts.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <p className="font-medium text-red-900">
                            Invalid Contacts
                          </p>
                          <p className="text-2xl font-bold text-red-600">
                            {invalidContacts.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {invalidContacts.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-3">
                        Validation Errors:
                      </h4>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {invalidContacts.slice(0, 10).map((contact, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border"
                          >
                            <p className="font-medium text-sm">
                              Row {contact._rowNumber}: {contact.firstName}{" "}
                              {contact.lastName}
                            </p>
                            <ul className="text-xs text-red-600 mt-1">
                              {contact._errors.map(
                                (error: string, errorIndex: number) => (
                                  <li key={errorIndex}>• {error}</li>
                                )
                              )}
                            </ul>
                          </div>
                        ))}
                        {invalidContacts.length > 10 && (
                          <p className="text-sm text-gray-600">
                            ... and {invalidContacts.length - 10} more invalid
                            contacts
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP 4: DUPLICATE HANDLING */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Handle Duplicate Contacts</CardTitle>
              <p className="text-gray-600">
                Found {duplicates.length} potential duplicate groups
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Checking for duplicates...</span>
                    <span>{duplicateCheckProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${duplicateCheckProgress}%` }}
                    />
                  </div>
                </div>
              ) : duplicates.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    No duplicates found!
                  </p>
                  <p className="text-gray-600">
                    All contacts are unique and ready to import.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {duplicates.map((group, groupIndex) => (
                    <div key={groupIndex} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Duplicate Group {groupIndex + 1} ({group.length}{" "}
                        contacts)
                      </h4>

                      <div className="grid gap-3 mb-4">
                        {group.map((contact: any, contactIndex: number) => (
                          <div
                            key={contactIndex}
                            className="bg-gray-50 p-3 rounded"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {contact.firstName} {contact.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {contact.email}
                                </p>
                                {contact.phone && (
                                  <p className="text-sm text-gray-600">
                                    {contact.phone}
                                  </p>
                                )}
                                {contact.company && (
                                  <p className="text-sm text-gray-600">
                                    {contact.company}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                Row {contact._rowNumber}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          How should we handle this duplicate?
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`duplicate_${groupIndex}`}
                              value="skip_all"
                              checked={
                                duplicateResolutions[groupIndex] === "skip_all"
                              }
                              onChange={(e) =>
                                handleDuplicateResolution(
                                  groupIndex,
                                  e.target.value
                                )
                              }
                              className="mr-2"
                            />
                            Skip all duplicates
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`duplicate_${groupIndex}`}
                              value="import_first"
                              checked={
                                duplicateResolutions[groupIndex] ===
                                "import_first"
                              }
                              onChange={(e) =>
                                handleDuplicateResolution(
                                  groupIndex,
                                  e.target.value
                                )
                              }
                              className="mr-2"
                            />
                            Import first contact only
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`duplicate_${groupIndex}`}
                              value="import_all"
                              checked={
                                duplicateResolutions[groupIndex] ===
                                "import_all"
                              }
                              onChange={(e) =>
                                handleDuplicateResolution(
                                  groupIndex,
                                  e.target.value
                                )
                              }
                              className="mr-2"
                            />
                            Import all as separate contacts
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP 5: IMPORT */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Import Contacts</CardTitle>
              <p className="text-gray-600">
                {importComplete
                  ? "Import completed!"
                  : "Importing your contacts..."}
              </p>
            </CardHeader>
            <CardContent>
              {isImporting ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Importing contacts...</span>
                    <span>{importProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              ) : importComplete ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Import Complete!
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <p className="font-medium text-green-900">Imported</p>
                      <p className="text-2xl font-bold text-green-600">
                        {importedCount}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <AlertCircle className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                      <p className="font-medium text-yellow-900">Skipped</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {skippedCount}
                      </p>
                    </div>
                  </div>

                  {importErrors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">
                        Import Errors:
                      </h4>
                      <div className="max-h-32 overflow-y-auto">
                        <ul className="text-sm text-red-700 space-y-1">
                          {importErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="flex-1"
                    >
                      View Contacts
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="flex-1"
                    >
                      Import More
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* NAVIGATION BUTTONS */}
        {!importComplete && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || isLoading}
            >
              Previous
            </Button>
            <Button onClick={goToNextStep} disabled={!canProceed || isLoading}>
              {currentStep === 5 ? "Start Import" : "Next"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
