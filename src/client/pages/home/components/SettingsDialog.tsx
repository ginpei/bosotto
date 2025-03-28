import React, { useRef, useState } from 'react';
import Dialog from '../../../shared/components/Dialog';
import { PersistenceStore } from '../../../shared/persistence/persistenceStore';
import { usePersistenceStore } from '../../../shared/persistence/persistenceHooks';

// Non-dismissible reload modal component
const ReloadModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-sm w-full">
        <div className="animate-spin mb-4 mx-auto h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <h3 className="text-lg font-bold mb-2">Import Successful!</h3>
        <p className="mb-4">
          Your data has been imported successfully. The page is now reloading to apply the changes...
        </p>
      </div>
    </div>
  );
};

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const [store] = usePersistenceStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle exporting data
  const handleExport = () => {
    try {
      // Create a JSON string from the store
      const dataStr = JSON.stringify(store, null, 2);
      
      // Create a blob from the JSON string
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(dataBlob);
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `bosotto-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Show success message
      setError(null);
      setSuccess('Data exported successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error exporting data:', err);
      setSuccess(null);
      setError('Failed to export data');
    }
  };

  // Function to validate imported data
  const validateImportedData = (data: any): data is PersistenceStore => {
    // Check if data is an object
    if (!data || typeof data !== 'object') return false;
    
    // Check if data has required fields
    if (!('version' in data) || typeof data.version !== 'number') return false;
    if (!('posts' in data) || !Array.isArray(data.posts)) return false;
    
    // Check if posts have required fields
    for (const post of data.posts) {
      if (!post.id || !post.type || !post.content || !post.createdAt || !post.updatedAt) {
        return false;
      }
      if (post.type !== 'post') return false;
    }
    
    return true;
  };

  // Function to handle importing data
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate the imported data
        if (!validateImportedData(importedData)) {
          throw new Error('Invalid data format');
        }
        
        // Use localStorage directly to set the imported data
        localStorage.setItem('bosotto:data', JSON.stringify(importedData));
        
        // Show success message, set reloading state, and reload the page
        setError(null);
        setSuccess('Data imported successfully!');
        setIsReloading(true);
        
        // Close the settings dialog
        onClose();
        
        // Reload the page after a delay to refresh the data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {
        console.error('Error importing data:', err);
        setSuccess(null);
        setError('Failed to import data. Please make sure the file is a valid Bosotto export.');
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setSuccess(null);
      setError('Error reading the file');
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <>
      {isReloading && <ReloadModal />}
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title="Settings"
      >
      <div className="text-sm">
        <h4 className="font-medium mb-4">Data Management</h4>
        
        {/* Show global success message at the top */}
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          {/* Export Section */}
          <div>
            <h5 className="font-medium mb-2">Export Data</h5>
            <p className="text-gray-600 mb-2">
              Download all your notes as a JSON file for backup or transfer.
            </p>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Export Data
            </button>
          </div>
          
          {/* Import Section */}
          <div>
            <h5 className="font-medium mb-2">Import Data</h5>
            <p className="text-gray-600 mb-2">
              Import notes from a previously exported JSON file.
              <br />
              <span className="text-red-600">Warning: This will replace your current data.</span>
            </p>
            
            {/* Display error message specifically for the import function */}
            {error && (
              <div className="mt-1 mb-2 p-2 bg-red-100 text-red-700 rounded text-xs">
                {error}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <label
                htmlFor="import-file"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded cursor-pointer"
              >
                Select File to Import
              </label>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    </>
  );
};

export default SettingsDialog;