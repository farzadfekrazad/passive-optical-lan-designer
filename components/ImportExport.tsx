import React, { useRef } from 'react';
import type { OltDevice, OntDevice } from '../types';
import { useI18n } from '../contexts/I18nContext';

interface ImportExportProps {
    oltDevices: OltDevice[];
    ontDevices: OntDevice[];
    onImport: (data: { olts: OltDevice[], onts: OntDevice[] }) => void;
    disabled?: boolean;
}

const ImportExport: React.FC<ImportExportProps> = ({ oltDevices, ontDevices, onImport, disabled }) => {
    const { t } = useI18n();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = {
            olts: oltDevices,
            onts: ontDevices,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "pol-designer-catalog.json";
        link.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read");
                }
                const parsedData = JSON.parse(text);
                
                if (Array.isArray(parsedData.olts) && Array.isArray(parsedData.onts)) {
                    onImport({ olts: parsedData.olts, onts: parsedData.onts });
                } else {
                    throw new Error("Invalid file format. 'olts' and 'onts' arrays are required.");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error("Error importing file:", error);
                alert(t('importExport.importError', { error: errorMessage }));
            }
        };
        reader.readAsText(file);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">{t('importExport.title')}</h3>
            <div className="flex gap-4">
                <button
                    onClick={handleExport}
                    className="bg-gray-700 hover:bg-gray-600 text-cyan-300 font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    {t('importExport.export')}
                </button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
                <button
                    onClick={handleImportClick}
                    disabled={disabled}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {t('importExport.import')}
                </button>
            </div>
        </div>
    );
};

export default ImportExport;