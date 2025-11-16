import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ChevronDown, HelpCircle, X, CheckCircle, Loader2, FileText } from 'lucide-react';

interface FormErrors {
  department?: string;
  service?: string;
  subject?: string;
  description?: string;
}

const CreateTicket: React.FC = () => {
  const [department, setDepartment] = useState('');
  const [service, setService] = useState('');
  const [priority, setPriority] = useState(2); // Default to High
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill from sessionStorage or incoming events
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('helpdeskPrefill');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.department) setDepartment(data.department);
        if (data.service) setService(data.service);
        if (typeof data.priority === 'number') setPriority(data.priority);
        if (data.subject) setSubject(data.subject);
        if (data.description) setDescription(data.description);
        sessionStorage.removeItem('helpdeskPrefill');
      }
    } catch {}
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Prevent duplicates and limit total files if needed
      const uniqueNewFiles = newFiles.filter(
        (newFile) => !attachments.some((existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size)
      );
      setAttachments((prev) => [...prev, ...uniqueNewFiles]);
    }
     // Reset file input to allow selecting the same file again if needed
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!department) newErrors.department = 'Veuillez sélectionner un département.';
    if (!service) newErrors.service = 'Veuillez sélectionner un service.';
    if (!subject.trim()) newErrors.subject = 'L\'objet est requis.';
    if (!description.trim()) newErrors.description = 'La description est requise.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false); // Reset success state

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful submission
    const mockTicketId = `TICKET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setSubmittedTicketId(mockTicketId);
    setSubmitSuccess(true);
    setIsSubmitting(false);

    // Optionally reset form fields after success
    // setDepartment('');
    // setService('');
    // setPriority(2);
    // setSubject('');
    // setDescription('');
    // setAttachments([]);
    // setErrors({});
  };

  const priorityLevels = [
    { value: 0, label: 'Faible', color: 'text-green-600', ring: 'focus:ring-green-500' },
    { value: 1, label: 'Moyenne', color: 'text-yellow-600', ring: 'focus:ring-yellow-500' },
    { value: 2, label: 'Haute', color: 'text-orange-600', ring: 'focus:ring-orange-500' },
    { value: 3, label: 'Urgente', color: 'text-red-600', ring: 'focus:ring-red-500' },
  ];

  const supportNote = `
    Ce service fournit un support pour tous les problèmes techniques liés à votre service d'hébergement web.
    Veuillez noter que l'assistance technique ne résout pas les problèmes liés à vos scripts, à la conception
    de sites web ou à tout ce qui touche la conception de sites web. Notez que les tâches susmentionnées
    sont celles du webmestre ou du développeur web.
  `;

  // Success Message Component
  if (submitSuccess && submittedTicketId) {
    return (
      // Apply max-width and centering to the success message container
      <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-lg mx-auto text-center bg-green-50 border border-green-200 rounded-lg shadow-sm p-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Ticket soumis avec succès !</h2>
            <p className="text-gray-700 mb-4">
              Votre ticket a été créé. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <p className="text-lg font-medium text-gray-800 mb-6">
              Votre numéro de ticket : <strong className="text-[#DC0032]">{submittedTicketId}</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  // Navigate to the ticket detail view
                  window.location.hash = `#/helpdesk/ticket/${submittedTicketId}`;
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Voir le ticket
              </button>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setSubmittedTicketId(null);
                  // Reset form fields if desired
                  setDepartment('');
                  setService('');
                  setPriority(2);
                  setSubject('');
                  setDescription('');
                  setAttachments([]);
                  setErrors({});
                }}
                className="px-6 py-2 bg-[#DC0032] text-white rounded-lg hover:bg-[#c40029] transition-colors font-medium"
              >
                Créer un autre ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Apply max-width and centering to the main form container
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Ouvrir un nouveau ticket</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Département <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-0.5"
                aria-label="Information sur le support technique"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              {showTooltip && (
                <div
                  className="absolute right-0 z-10 mt-2 w-64 p-3 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg transition-opacity duration-200 text-xs"
                  role="tooltip"
                >
                  <p className="whitespace-pre-line">
                    {supportNote}
                  </p>
                  <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 border-t border-l border-gray-700 transform rotate-45" />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Support technique', 'Commercial/Facturation', 'Préventes'].map((dept) => (
              <button
                type="button"
                key={dept}
                onClick={() => { setDepartment(dept); setErrors(prev => ({ ...prev, department: undefined })); }}
                className={`p-4 rounded-lg border text-left transition-all duration-150 ${
                  department === dept
                    ? 'border-[#DC0032] bg-[#FFF5F7] ring-1 ring-[#DC0032]'
                    : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                <span className={`block text-sm font-medium ${department === dept ? 'text-[#DC0032]' : 'text-gray-700'}`}>{dept}</span>
              </button>
            ))}
          </div>
          {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
        </div>

        {/* Service & Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Selection */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Service <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="service"
                value={service}
                onChange={(e) => { setService(e.target.value); setErrors(prev => ({ ...prev, service: undefined })); }}
                className={`w-full px-3 py-2 text-sm border rounded-md appearance-none bg-white ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? "service-error" : undefined}
              >
                <option value="" disabled>Sélectionner un service...</option>
                <option value="hosting-basic">Hébergement Web - Basic</option>
                <option value="hosting-pro">Hébergement Web - Pro</option>
                <option value="vps-starter">VPS - Starter</option>
                <option value="domain-reg">Enregistrement Domaine</option>
                <option value="other">Autre</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.service && <p id="service-error" className="text-xs text-red-600 mt-1">{errors.service}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="3"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-[#DC0032] ${priorityLevels[priority].ring}`}
                aria-label={`Priorité: ${priorityLevels[priority].label}`}
              />
              <div className="flex justify-between text-xs font-medium">
                {priorityLevels.map((level) => (
                  <span
                    key={level.value}
                    className={`${
                      priority === level.value ? level.color : 'text-gray-500'
                    }`}
                  >
                    {level.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Objet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setErrors(prev => ({ ...prev, subject: undefined })); }}
            className={`w-full px-3 py-2 text-sm border rounded-md ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ex: Problème de connexion à l'espace client"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && <p id="subject-error" className="text-xs text-red-600 mt-1">{errors.subject}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: undefined })); }}
            className={`w-full px-3 py-2 text-sm border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Décrivez votre problème en détail. Incluez les étapes pour reproduire le problème, les messages d'erreur exacts, etc."
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && <p id="description-error" className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pièces jointes (Optionnel)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              onDragOver={(e) => e.preventDefault()} // Necessary for drop events
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) {
                  const droppedFiles = Array.from(e.dataTransfer.files);
                   const uniqueNewFiles = droppedFiles.filter(
                     (newFile) => !attachments.some((existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size)
                   );
                  setAttachments((prev) => [...prev, ...uniqueNewFiles]);
                }
              }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <Paperclip className="w-8 h-8 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-[#DC0032]">Cliquez pour téléverser</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">
                  Max 10MB par fichier (PNG, JPG, PDF, ZIP...)
                </p>
              </div>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-600">Fichiers ajoutés :</p>
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 border border-gray-200 rounded-lg text-sm">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate" title={file.name}>{file.name}</span>
                    <span className="text-gray-500 text-xs flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    aria-label={`Retirer ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-3 bg-[#DC0032] text-white rounded-lg hover:bg-[#c40029] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <span>Soumettre le ticket</span>
            )}
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
