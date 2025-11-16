import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Upload, Download, X } from 'lucide-react';
import ImportContactsModal from './ImportContactsModal';
import FormField from '../ui/FormField';
import LoadingButton from '../ui/LoadingButton';
import EmptyState from '../ui/EmptyState';
import SearchInput from '../ui/SearchInput';
import { validateRequired, validatePhone } from '../../utils/validation';

interface Contact {
  id: number;
  name: string;
  phone: string;
  group: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
}

const ContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'John Doe', phone: '+1234567890', group: 'Clients' },
    { id: 2, name: 'Jane Smith', phone: '+0987654321', group: 'Prospects' },
  ]);
  const [newContactPopupOpen, setNewContactPopupOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false); // State for import modal
  const [newContact, setNewContact] = useState({ name: '', phone: '', group: '' });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset success message after a delay when popup closes
  useEffect(() => {
    if (!newContactPopupOpen) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 500); // Delay to allow fade-out animations if any
      return () => clearTimeout(timer);
    }
  }, [newContactPopupOpen]);


  const handleOpenNewContactPopup = () => {
    setNewContact({ name: '', phone: '', group: '' }); // Reset form
    setValidationErrors({}); // Clear errors
    setSubmitSuccess(false); // Reset success state
    setNewContactPopupOpen(true);
  };

  const handleCloseNewContactPopup = () => {
    setNewContactPopupOpen(false);
    // No need to reset form here, it's done on open and submit
  };

  const handleOpenImportModal = () => {
    setImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setImportModalOpen(false);
  };

  const handleContactsImported = (newContactsToImport: Omit<Contact, 'id'>[]) => {
    const contactsWithIds = newContactsToImport.map(contact => ({
        ...contact,
        id: Date.now() + Math.random(), // Simple unique ID generation for demo
    }));
    setContacts(prevContacts => [...prevContacts, ...contactsWithIds]);
    // Optionally show a success message/toast here
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContact(prevContact => ({
      ...prevContact,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    errors.name = validateRequired(newContact.name, 'Le nom');
    errors.phone = validateRequired(newContact.phone, 'Le numéro de téléphone');
    
    if (!errors.phone && !validatePhone(newContact.phone)) {
      errors.phone = 'Format de téléphone invalide.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).filter(key => errors[key as keyof ValidationErrors]).length === 0;
  };

  const handleAddNewContact = () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);
    setSubmitSuccess(false); // Reset success state before new submission

    // Simulate API call delay
    setTimeout(() => {
      const newContactToAdd: Contact = {
        id: Date.now(), // Use timestamp or UUID for better unique ID in real app
        ...newContact
      };
      setContacts(prevContacts => [...prevContacts, newContactToAdd]);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Optionally close popup after a short delay to show success message
      setTimeout(() => {
         handleCloseNewContactPopup();
      }, 1500); // Keep modal open for 1.5 seconds to show success
    }, 500); // Simulate network latency
  };

  const handleDeleteContact = (id: number) => {
    // TODO: Add confirmation dialog
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    }
  }

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Apply max-width and centering here */}
      <div className="max-w-[72rem] mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            {/* Search and Add/Import Buttons */}
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Rechercher contacts..."
                className="flex-grow md:flex-grow-0 md:w-64"
              />
              <LoadingButton
                variant="primary"
                size="md"
                onClick={handleOpenNewContactPopup}
              >
                <Plus size={16} className="mr-2" />
                Ajouter
              </LoadingButton>
              {/* Import Button */}
              <button
                className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
                onClick={handleOpenImportModal}
                title="Importer depuis CSV"
              >
                <Upload size={20} className="mr-1 md:mr-2" />
                Importer
              </button>
            </div>
            {/* Action Buttons (Export) */}
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-[#DC0032] hover:bg-gray-100 rounded-full transition-colors" title="Exporter">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Nom</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Téléphone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Groupe</th> {/* Hide on small screens */}
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800">{contact.name}</td>
                      <td className="py-3 px-4 text-gray-600">{contact.phone}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{contact.group || '-'}</td> {/* Hide on small screens */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <EmptyState
                        title={searchTerm ? "Aucun contact trouvé" : "Aucun contact"}
                        description={searchTerm ? "Essayez de modifier votre recherche" : "Commencez par ajouter votre premier contact"}
                        action={!searchTerm ? {
                          label: "Ajouter un contact",
                          onClick: handleOpenNewContactPopup
                        } : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Contact Popup / Modal */}
      {newContactPopupOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <button
              onClick={handleCloseNewContactPopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">Ajouter un nouveau contact</h2>

            {/* Form Fields */}
            <div className="space-y-4">
              <FormField label="Nom" required error={validationErrors.name}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 px-3 py-2 ${
                    validationErrors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                      : 'border-gray-300 focus:border-[#DC0032] focus:ring-[#DC0032]'
                  }`}
                  value={newContact.name}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom complet"
                  aria-required="true"
                  aria-invalid={!!validationErrors.name}
                  aria-describedby={validationErrors.name ? "name-error" : undefined}
                />
              </FormField>

              <FormField label="Téléphone" required error={validationErrors.phone}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 px-3 py-2 ${
                    validationErrors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                      : 'border-gray-300 focus:border-[#DC0032] focus:ring-[#DC0032]'
                  }`}
                  value={newContact.phone}
                  onChange={handleInputChange}
                  placeholder="+33 6 12 34 56 78"
                  aria-required="true"
                  aria-invalid={!!validationErrors.phone}
                  aria-describedby={validationErrors.phone ? "phone-error" : undefined}
                />
              </FormField>

              <FormField label="Groupe">
                <select
                  id="group"
                  name="group"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-[#DC0032] focus:ring-2 focus:ring-[#DC0032] focus:ring-opacity-50 px-3 py-2"
                  value={newContact.group}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner un groupe (Optionnel)</option>
                  <option value="Clients">Clients</option>
                  <option value="Prospects">Prospects</option>
                  <option value="Partners">Partenaires</option>
                  <option value="Employees">Employés</option>
                  <option value="VIP">VIP</option>
                  <option value="Other">Autre</option>
                </select>
              </FormField>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
                Contact ajouté avec succès !
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-700 mr-3 transition-colors"
                onClick={handleCloseNewContactPopup}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <LoadingButton
                loading={isSubmitting}
                loadingText="Ajout en cours..."
                onClick={handleAddNewContact}
              >
                Ajouter le contact
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {/* Import Contacts Modal */}
      <ImportContactsModal
        isOpen={importModalOpen}
        onClose={handleCloseImportModal}
        onContactsImported={handleContactsImported}
        existingContacts={contacts} // Pass current contacts for duplicate checking
      />
    </div>
  );
};

export default ContactsList;
