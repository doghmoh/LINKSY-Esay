import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import Papa from 'papaparse';
import { X, UploadCloud, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface Contact {
  id: number; // Assuming Contact type is defined elsewhere or passed in
  name: string;
  phone: string;
  group: string;
}

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactsImported: (newContacts: Omit<Contact, 'id'>[]) => void; // Function to add contacts to the main list
  existingContacts: Contact[]; // Pass existing contacts for duplicate checking
}

type CsvRow = { [key: string]: string };
type ColumnMap = {
  name: string | null;
  phone: string | null;
  group: string | null;
};
type RowError = { rowIndex: number; message: string };
type ImportStatus = 'idle' | 'parsing' | 'mapping' | 'validating' | 'importing' | 'complete';

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
  isOpen,
  onClose,
  onContactsImported,
  existingContacts,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap>({ name: null, phone: null, group: null });
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importSummary, setImportSummary] = useState({ imported: 0, skipped: 0, errors: 0 });
  const [fileError, setFileError] = useState<string | null>(null);

  // Reset state when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setHeaders([]);
      setParsedData([]);
      setColumnMap({ name: null, phone: null, group: null });
      setRowErrors([]);
      setImportStatus('idle');
      setImportSummary({ imported: 0, skipped: 0, errors: 0 });
      setFileError(null);
    }
  }, [isOpen]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Basic file type check (can be expanded for xlsx later)
      if (!selectedFile.name.endsWith('.csv')) {
         setFileError('Format de fichier invalide. Veuillez sélectionner un fichier .csv.');
         setFile(null);
         setImportStatus('idle');
         return;
      }
      setFileError(null);
      setFile(selectedFile);
      setImportStatus('parsing');
      parseCsvFile(selectedFile);
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const parseCsvFile = (csvFile: File) => {
    Papa.parse<CsvRow>(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
            console.error("CSV Parsing errors:", results.errors);
            setFileError(`Erreur lors de l'analyse du fichier CSV: ${results.errors[0].message}`);
            setImportStatus('idle');
            setFile(null);
            return;
        }
        if (results.data.length === 0) {
            setFileError("Le fichier CSV est vide ou ne contient aucune donnée.");
            setImportStatus('idle');
            setFile(null);
            return;
        }
        setHeaders(results.meta.fields || []);
        setParsedData(results.data);
        setImportStatus('mapping');
        // Auto-map common headers (case-insensitive)
        const autoMap: ColumnMap = { name: null, phone: null, group: null };
        const lowerCaseHeaders = (results.meta.fields || []).map(h => h.toLowerCase());
        const nameIndex = lowerCaseHeaders.findIndex(h => h.includes('nom') || h.includes('name'));
        const phoneIndex = lowerCaseHeaders.findIndex(h => h.includes('phone') || h.includes('téléphone') || h.includes('numero'));
        const groupIndex = lowerCaseHeaders.findIndex(h => h.includes('group') || h.includes('groupe'));
        if (nameIndex > -1) autoMap.name = results.meta.fields![nameIndex];
        if (phoneIndex > -1) autoMap.phone = results.meta.fields![phoneIndex];
        if (groupIndex > -1) autoMap.group = results.meta.fields![groupIndex];
        setColumnMap(autoMap);

      },
      error: (error) => {
        console.error("CSV Parsing error:", error);
        setFileError(`Erreur lors de la lecture du fichier: ${error.message}`);
        setImportStatus('idle');
        setFile(null);
      }
    });
  };

  const handleColumnMapChange = (field: keyof ColumnMap, value: string) => {
    setColumnMap(prev => ({ ...prev, [field]: value === '' ? null : value }));
  };

  const validateAndImport = () => {
    if (!columnMap.name || !columnMap.phone) {
      // Maybe show a more prominent error message
      alert("Veuillez mapper les colonnes 'Nom' et 'Téléphone'.");
      return;
    }

    setImportStatus('validating');
    setRowErrors([]);
    const newContactsToImport: Omit<Contact, 'id'>[] = [];
    const currentErrors: RowError[] = [];
    let skippedCount = 0;

    // Create a set of existing phone numbers for faster lookup
    const existingPhones = new Set(existingContacts.map(c => c.phone.replace(/\s+/g, ''))); // Normalize phone numbers

    parsedData.forEach((row, index) => {
      const name = row[columnMap.name!]?.trim();
      const phone = row[columnMap.phone!]?.trim();
      const group = columnMap.group ? row[columnMap.group]?.trim() : '';

      let rowIsValid = true;

      // Basic Validation
      if (!name) {
        currentErrors.push({ rowIndex: index + 2, message: 'Le nom est manquant.' }); // +2 for header row and 0-based index
        rowIsValid = false;
      }
      if (!phone) {
        currentErrors.push({ rowIndex: index + 2, message: 'Le numéro de téléphone est manquant.' });
        rowIsValid = false;
      } else if (!/^\+?[0-9\s\-()]+$/.test(phone)) {
         currentErrors.push({ rowIndex: index + 2, message: 'Format de téléphone invalide.' });
         rowIsValid = false;
      }

      // Duplicate Check (using normalized phone number)
      const normalizedPhone = phone?.replace(/\s+/g, '');
      if (rowIsValid && normalizedPhone && existingPhones.has(normalizedPhone)) {
        // Check if it's also a duplicate within the current import batch
        const isDuplicateInBatch = newContactsToImport.some(nc => nc.phone.replace(/\s+/g, '') === normalizedPhone);
        if (!isDuplicateInBatch) {
            skippedCount++;
            // Optionally add a specific error/warning for duplicates
            // currentErrors.push({ rowIndex: index + 2, message: 'Contact dupliqué (téléphone existant).' });
        } else {
             // It's a duplicate within the file itself, treat as error or skip silently
             currentErrors.push({ rowIndex: index + 2, message: 'Téléphone dupliqué dans le fichier.' });
             rowIsValid = false;
        }
        rowIsValid = false; // Mark as invalid to prevent import
      }


      if (rowIsValid) {
        newContactsToImport.push({ name: name!, phone: phone!, group: group || '' });
      }
    });

    setRowErrors(currentErrors);
    setImportStatus('importing'); // Simulate import delay

    setTimeout(() => { // Simulate API call or heavy processing
        onContactsImported(newContactsToImport);
        setImportSummary({
            imported: newContactsToImport.length,
            skipped: skippedCount,
            errors: currentErrors.length,
        });
        setImportStatus('complete');
    }, 500);
  };

  const isMappingComplete = columnMap.name && columnMap.phone;
  const isLoading = ['parsing', 'validating', 'importing'].includes(importStatus);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Importer des Contacts depuis CSV</h2>

        <div className="flex-grow overflow-y-auto pr-2"> {/* Scrollable content area */}
          {/* Step 1: File Upload */}
          {importStatus === 'idle' && !file && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <UploadCloud className="text-gray-400 mb-4" size={48} />
              <p className="mb-2 text-gray-600">Glissez-déposez votre fichier CSV ici</p>
              <p className="text-sm text-gray-500 mb-4">ou</p>
              <label className="cursor-pointer bg-[#DC0032] text-white px-4 py-2 rounded-md hover:bg-[#c40029] transition-colors">
                <span>Sélectionner un fichier</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv" // Restrict to CSV for now
                  onChange={handleFileChange}
                />
              </label>
              {fileError && <p className="mt-4 text-sm text-red-600">{fileError}</p>}
               <p className="mt-4 text-xs text-gray-500">Formats supportés : .csv</p>
            </div>
          )}

          {/* Loading Indicator */}
          {importStatus === 'parsing' && (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="animate-spin text-[#DC0032] mb-4" size={48} />
                <p className="text-gray-600">Analyse du fichier en cours...</p>
             </div>
          )}


          {/* Step 2: Column Mapping */}
          {file && ['mapping', 'validating', 'importing', 'complete'].includes(importStatus) && (
            <div>
              <p className="mb-4 text-sm font-medium text-gray-700">Fichier sélectionné: <span className="font-normal">{file.name}</span></p>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Mapper les colonnes</h3>
              <p className="text-sm text-gray-600 mb-4">Faites correspondre les colonnes de votre fichier CSV aux champs de contact requis.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Name Mapping */}
                <div>
                  <label htmlFor="map-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="map-name"
                    value={columnMap.name || ''}
                    onChange={(e) => handleColumnMapChange('name', e.target.value)}
                    className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 ${!columnMap.name && importStatus === 'mapping' ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : 'border-gray-300 focus:border-[#DC0032] focus:ring-[#DC0032]'}`}
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner la colonne...</option>
                    {headers.map(header => <option key={header} value={header}>{header}</option>)}
                  </select>
                </div>

                {/* Phone Mapping */}
                <div>
                  <label htmlFor="map-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="map-phone"
                    value={columnMap.phone || ''}
                    onChange={(e) => handleColumnMapChange('phone', e.target.value)}
                     className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 ${!columnMap.phone && importStatus === 'mapping' ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : 'border-gray-300 focus:border-[#DC0032] focus:ring-[#DC0032]'}`}
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner la colonne...</option>
                    {headers.map(header => <option key={header} value={header}>{header}</option>)}
                  </select>
                </div>

                {/* Group Mapping */}
                <div>
                  <label htmlFor="map-group" className="block text-sm font-medium text-gray-700 mb-1">
                    Groupe <span className="text-gray-500">(Optionnel)</span>
                  </label>
                  <select
                    id="map-group"
                    value={columnMap.group || ''}
                    onChange={(e) => handleColumnMapChange('group', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#DC0032] focus:ring-2 focus:ring-[#DC0032] focus:ring-opacity-50"
                    disabled={isLoading}
                  >
                    <option value="">Sélectionner la colonne...</option>
                    {headers.map(header => <option key={header} value={header}>{header}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Validation Errors & Import Summary */}
          {importStatus === 'complete' && (
             <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Résumé de l'importation</h3>
                 <div className="flex items-center text-green-600 mb-2">
                    <CheckCircle size={18} className="mr-2"/>
                    <span>{importSummary.imported} contact(s) importé(s) avec succès.</span>
                 </div>
                 {importSummary.skipped > 0 && (
                    <div className="flex items-center text-yellow-600 mb-2">
                        <AlertTriangle size={18} className="mr-2"/>
                        <span>{importSummary.skipped} contact(s) ignoré(s) (doublons).</span>
                    </div>
                 )}
                 {importSummary.errors > 0 && (
                    <div className="flex items-center text-red-600 mb-2">
                        <AlertTriangle size={18} className="mr-2"/>
                        <span>{importSummary.errors} ligne(s) avec des erreurs.</span>
                    </div>
                 )}

                 {rowErrors.length > 0 && (
                    <details className="mt-3">
                        <summary className="text-sm text-blue-600 cursor-pointer hover:underline">Voir les erreurs détaillées</summary>
                        <ul className="mt-2 list-disc list-inside text-xs text-red-700 max-h-32 overflow-y-auto bg-red-50 p-2 rounded border border-red-200">
                            {rowErrors.slice(0, 50).map((err, i) => ( // Limit displayed errors
                                <li key={i}>Ligne {err.rowIndex}: {err.message}</li>
                            ))}
                             {rowErrors.length > 50 && <li>... et {rowErrors.length - 50} autres erreurs.</li>}
                        </ul>
                    </details>
                 )}
             </div>
          )}
           {/* Validation/Importing Indicator */}
           {['validating', 'importing'].includes(importStatus) && (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="animate-spin text-[#DC0032] mb-4" size={48} />
                <p className="text-gray-600">{importStatus === 'validating' ? 'Validation des données...' : 'Importation des contacts...'}</p>
             </div>
          )}
        </div> {/* End Scrollable content area */}


        {/* Action Buttons */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          {importStatus !== 'complete' && (
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700 mr-3 transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </button>
          )}
          {importStatus === 'mapping' && (
            <button
              type="button"
              className={`bg-[#DC0032] hover:bg-[#c40029] text-white px-4 py-2 rounded-md transition-colors ${
                !isMappingComplete || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={validateAndImport}
              disabled={!isMappingComplete || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin inline mr-2" size={16}/> : null}
              {isLoading ? 'Traitement...' : 'Importer les contacts'}
            </button>
          )}
           {/* --- FIX START --- */}
           {importStatus === 'complete' && (
             <button
               type="button"
               className="bg-[#DC0032] hover:bg-[#c40029] text-white px-4 py-2 rounded-md transition-colors"
               onClick={onClose}
             >
               Fermer
             </button>
           )}
           {/* --- FIX END --- */}
        </div>
      </div>
    </div>
  );
};

export default ImportContactsModal;
