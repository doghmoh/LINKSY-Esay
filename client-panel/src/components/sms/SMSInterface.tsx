import React, { useState } from 'react';
import { Clock, Send, Users, UserPlus, MessageSquare, Hash, Coins, X } from 'lucide-react';
import LoadingButton from '../ui/LoadingButton';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import MessageComposer from './MessageComposer';
import MessagePreview from './MessagePreview';
import { calculateMessageStats } from './utils/messageUtils';
import { validateRequired } from '../../utils/validation';

const SMSInterface = () => {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const messageStats = calculateMessageStats(message);
  const [groupPopupOpen, setGroupPopupOpen] = useState(false);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [schedulePopupOpen, setSchedulePopupOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const availableGroups = [
    { name: 'Clients', count: 50 },
    { name: 'Prospects', count: 30 },
    { name: 'Partners', count: 20 },
    { name: 'Employees', count: 100 },
  ];

  const availableContacts = [
    { name: 'John Doe', phone: '+1234567890' },
    { name: 'Jane Smith', phone: '+0987654321' },
    { name: 'Alice Johnson', phone: '+1122334455' },
    { name: 'Bob Williams', phone: '+9988776655' },
  ];

  const handleGroupSelect = (groupName: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName]
    );
  };

  const handleContactSelect = (contactPhone: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactPhone)
        ? prev.filter((phone) => phone !== contactPhone)
        : [...prev, contactPhone]
    );
  };

  const toggleGroupPopup = () => {
    setGroupPopupOpen(!groupPopupOpen);
  };

  const toggleContactPopup = () => {
    setContactPopupOpen(!contactPopupOpen);
  };

  const toggleSchedulePopup = () => {
    setSchedulePopupOpen(!schedulePopupOpen);
  };

  const toggleConfirmationPopup = () => {
    setConfirmationPopupOpen(!confirmationPopupOpen);
  };

  const handleScheduleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const now = new Date();
    const minTime = new Date(now.getTime() + 60 * 60 * 1000); // Minimum 1 hour from now

    if (selectedDate < minTime) {
      alert('Veuillez sélectionner une date et une heure au moins une heure à partir de maintenant.');
      setScheduledTime(minTime);
    } else {
      setScheduledTime(selectedDate);
    }
  };

  const generateDefaultCampaignName = () => {
    const now = new Date();
    return `Campagne ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const handleSendConfirmation = (scheduling: boolean = false) => {
    const recipients = [...selectedGroups, ...selectedContacts];
    if (recipients.length === 0) {
      alert('Veuillez sélectionner au moins un groupe ou un contact.');
      return;
    }
    if (!message) {
      alert('Veuillez saisir un message.');
      return;
    }
    setIsScheduling(scheduling);
    toggleConfirmationPopup();
  };

  const handleSendOrSchedule = () => {
    const recipients = [...selectedGroups, ...selectedContacts];
    
    const messageError = validateRequired(message, 'Le message');
    if (messageError || recipients.length === 0) {
      alert('Erreur: Destinataires ou message manquants.');
      toggleConfirmationPopup();
      return;
    }

    const finalCampaignName = campaignName || generateDefaultCampaignName();
    const totalCredits = messageStats.parts * recipients.length;

    if (isScheduling && scheduledTime) {
      console.log('Message programmé pour:', scheduledTime);
      alert(`Message programmé pour le ${scheduledTime.toLocaleString()} avec le nom de campagne: ${finalCampaignName}. Total de crédits consommés: ${totalCredits}`);
      // Reset schedule specific state
      setScheduledTime(null);
      setSchedulePopupOpen(false); // Close schedule popup if open
    } else {
      console.log('Message envoyé:');
      alert(`Message envoyé avec le nom de campagne: ${finalCampaignName}. Total de crédits consommés: ${totalCredits}`);
    }

    // Reset common state after sending/scheduling
    toggleConfirmationPopup();
    setCampaignName('');
    setMessage('');
    setSender('');
    setSelectedGroups([]);
    setSelectedContacts([]);
    setIsScheduling(false); // Reset scheduling flag
  };

  const handleSchedule = () => {
    if (scheduledTime) {
      handleSendConfirmation(true);
      toggleSchedulePopup(); // Close schedule popup after setting time
    } else {
      alert('Veuillez sélectionner une date et une heure pour programmer le message.');
    }
  };

  return (
    <div className="p-6">
      {/* Apply max-width and centering here */}
      <div className="max-w-[72rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message Composer Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <MessageComposer
                message={message}
                onMessageChange={setMessage}
                sender={sender}
                onSenderChange={setSender}
                onGroupSelect={toggleGroupPopup}
                onContactSelect={toggleContactPopup}
              />
              {/* Display Selected Groups */}
              {selectedGroups.length > 0 && (
                <div className="mt-4">
                  <span className="block text-sm font-medium text-gray-700 mb-1.5">
                    Groupes sélectionnés:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroups.map((groupName) => (
                      <span
                        key={groupName}
                        className="bg-[#DC0032] text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                      >
                        {groupName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Display Selected Contacts */}
              {selectedContacts.length > 0 && (
                <div className="mt-4">
                  <span className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contacts sélectionnés:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedContacts.map((contactPhone) => (
                      <span
                        key={contactPhone}
                        className="bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                      >
                        {contactPhone}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span>{messageStats.characters} caractères</span>
                  <span className="mx-2">•</span>
                  <span>{messageStats.parts} {messageStats.parts > 1 ? 'messages' : 'message'}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    onClick={toggleSchedulePopup}
                  >
                    <Clock size={18} className="mr-2" />
                    Programmer
                  </button>
                  <LoadingButton
                    variant="primary"
                    onClick={() => handleSendConfirmation()}
                    disabled={!message || ([...selectedGroups, ...selectedContacts].length === 0)}
                  >
                    <Send size={18} className="mr-2" />
                    Envoyer
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-20 flex flex-col h-full">
            <MessagePreview
              message={message}
              sender={sender || 'LINKSY'}
              messageStats={messageStats}
            />
          </div>
        </div>
      </div>

      {/* Group Selection Popup */}
      <Modal
        isOpen={groupPopupOpen}
        onClose={toggleGroupPopup}
        title="Sélectionner des groupes"
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableGroups.map((group) => (
              <label
                key={group.name}
                className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#DC0032] focus:ring-[#DC0032] rounded"
                    value={group.name}
                    checked={selectedGroups.includes(group.name)}
                    onChange={() => handleGroupSelect(group.name)}
                  />
                  <span className="ml-2 text-gray-700">{group.name}</span>
                </div>
                <span className="text-gray-500 text-sm">{group.count} contacts</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              onClick={toggleGroupPopup}
            >
              Annuler
            </button>
            <LoadingButton variant="primary" onClick={toggleGroupPopup}>
              Valider
            </LoadingButton>
          </div>
        </div>
      </Modal>

      {/* Contact Selection Popup */}
      <Modal
        isOpen={contactPopupOpen}
        onClose={toggleContactPopup}
        title="Sélectionner des contacts"
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableContacts.map((contact) => (
              <label
                key={contact.phone}
                className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#DC0032] focus:ring-[#DC0032] rounded"
                    value={contact.phone}
                    checked={selectedContacts.includes(contact.phone)}
                    onChange={() => handleContactSelect(contact.phone)}
                  />
                  <span className="ml-2 text-gray-700">{contact.name}</span>
                </div>
                <span className="text-gray-500 text-sm">{contact.phone}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              onClick={toggleContactPopup}
            >
              Annuler
            </button>
            <LoadingButton variant="primary" onClick={toggleContactPopup}>
              Valider
            </LoadingButton>
          </div>
        </div>
      </Modal>

      {/* Schedule Popup */}
      <Modal
        isOpen={schedulePopupOpen}
        onClose={toggleSchedulePopup}
        title="Programmer le message"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Sélectionner la date et l'heure" required>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#DC0032] focus:border-[#DC0032]"
              onChange={handleScheduleTimeChange}
              value={scheduledTime ? scheduledTime.toISOString().slice(0, 16) : ''}
            />
          </FormField>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              onClick={toggleSchedulePopup}
            >
              Annuler
            </button>
            <LoadingButton
              variant="primary"
              onClick={handleSchedule}
              disabled={!scheduledTime}
            >
              Programmer
            </LoadingButton>
          </div>
        </div>
      </Modal>

      {/* Confirmation Popup */}
      <Modal
        isOpen={confirmationPopupOpen}
        onClose={toggleConfirmationPopup}
        title="Confirmation"
        size="md"
      >
        <div className="space-y-4">
          {/* Summary Display */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              <div className="flex items-start">
                <strong className="w-36 mr-2 flex-shrink-0 text-sm">Message:</strong>
                <span className="text-gray-700 text-sm break-all">{message}</span>
              </div>
              <div className="flex items-center">
                <strong className="w-36 mr-2 flex-shrink-0 text-sm">Caractères:</strong>
                <span className="text-gray-700 text-sm">{messageStats.characters}</span>
              </div>
              <div className="flex items-center">
                <strong className="w-36 mr-2 flex-shrink-0 text-sm">Nb. Messages:</strong>
                <span className="text-gray-700 text-sm">{messageStats.parts}</span>
              </div>
              <div className="flex items-start">
                <strong className="w-36 mr-2 flex-shrink-0 text-sm">Destinataires:</strong>
                <div className="text-gray-700 text-sm">
                  {([...selectedGroups, ...selectedContacts].length > 0) ?
                    ([...selectedGroups, ...selectedContacts].join(', ')) :
                    'Aucun destinataire sélectionné'}
                </div>
              </div>
              <div className="flex items-center">
                <strong className="w-36 mr-2 flex items-center flex-shrink-0 text-sm">
                  <Coins className="w-4 h-4 mr-1 text-gray-500" />
                  Crédits Totaux:
                </strong>
                <span className="text-gray-700 font-semibold text-sm">{messageStats.parts * [...selectedGroups, ...selectedContacts].length}</span>
              </div>
              {isScheduling && scheduledTime && (
                <div className="flex items-center">
                  <strong className="w-36 mr-2 flex items-center flex-shrink-0 text-sm">
                    <Clock className="w-4 h-4 mr-1 text-gray-500" />
                    Heure programmée:
                  </strong>
                  <span className="text-gray-700 text-sm">{scheduledTime.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <FormField label="Nom de la campagne (facultatif)">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#DC0032] focus:border-[#DC0032]"
              placeholder={generateDefaultCampaignName()}
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700"
              onClick={toggleConfirmationPopup}
            >
              Annuler
            </button>
            <LoadingButton
              variant="primary"
              onClick={handleSendOrSchedule}
            >
              {isScheduling ? (
                <>
                  <Clock className="w-4 h-4 mr-2" /> Programmer
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Envoyer
                </>
              )}
            </LoadingButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SMSInterface;