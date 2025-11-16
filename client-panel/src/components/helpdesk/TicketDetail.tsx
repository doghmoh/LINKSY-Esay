import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Paperclip, ChevronLeft, AlertCircle, CheckCircle, Clock, XCircle, User, Headset, CheckSquare, Image, X, Loader2, MessageCircle, Shield, Key, Eye, EyeOff, Copy, Check, Zap, MessageSquare } from 'lucide-react';
import { Ticket } from '../../types';

interface Message {
  id: string;
  sender: 'Support' | 'User';
  content: string;
  timestamp: string;
  attachments?: { name: string; size: string; type: string }[];
  isRead?: boolean;
  isTyping?: boolean;
}

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  // Mock data - replace with actual data fetching
  const [ticket, setTicket] = useState<Ticket>({
    id: ticketId,
    subject: 'Problème de connexion',
    status: 'Answered',
    priority: 'High',
    created: '2024-01-01T09:55:00',
    description: 'Je ne parviens pas à me connecter à mon compte. Lorsque j\'essaie, j\'obtiens une erreur "Identifiants invalides", mais je suis sûr de mon mot de passe. J\'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l\'e-mail.',
    category: 'Support Technique',
    assignee: 'Jean Dupont',
    chatType: 'live'
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '2',
      sender: 'Support',
      content: 'Bonjour, merci de nous avoir contactés. Pourriez-vous s\'il vous plaît vérifier votre dossier spam pour l\'e-mail de réinitialisation ? Nous allons également vérifier nos logs de notre côté.',
      timestamp: '2024-01-01T10:30:00',
        attachments: [
          { name: 'guide_verification_spam.png', size: '1.2MB', type: 'image/png' },
        ],
      isRead: true
    },
    {
      id: '3',
      sender: 'User',
      content: 'J\'ai vérifié mon dossier spam et il n\'y a rien. Toujours bloqué. Voici une capture d\'écran de l\'erreur :',
      timestamp: '2024-01-01T11:15:00',
      attachments: [
        { name: 'erreur_connexion.jpg', size: '1.8MB', type: 'image/jpeg' }
      ],
      isRead: true
    },
    {
      id: '4',
      sender: 'Support',
      content: 'Merci pour la vérification. Nous avons identifié un problème potentiel avec l\'envoi d\'e-mails vers votre fournisseur. Pourriez-vous essayer de vous connecter en utilisant ce lien temporaire pendant que nous résolvons le problème ?',
      timestamp: '2024-01-01T11:45:00',
        attachments: [
          { name: 'instructions_connexion_temporaire.png', size: '85KB', type: 'image/png' }
        ],
      isRead: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = useCallback(async () => {
    if ((!newMessage.trim() && attachedFiles.length === 0) || ticket.status === 'Closed') return;

    setIsSending(true);
    // Simulate API call (longer delay for testing feedback)
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const message: Message = {
        id: String(Date.now()),
        sender: 'User',
        content: newMessage,
        timestamp: new Date().toISOString(),
        attachments: attachedFiles.map(file => ({ 
          name: file.name, 
          size: `${(file.size / 1024).toFixed(1)}KB`,
          type: file.type
        })),
        isRead: false
      };

      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage(''); // Clear input on successful send
      setAttachedFiles([]); // Clear attachments on successful send

      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }

      // Simulate support typing response
      setTimeout(() => {
        setIsTyping(true);
      }, 1000);

      if (ticket.status === 'Answered') {
         setTicket(prevTicket => ({ ...prevTicket, status: 'Pending' }));
      }

    } catch (error) {
        console.error("Failed to send message:", error);
        // Add user feedback for error state here if needed
    } finally {
      setIsSending(false);
    }
  }, [newMessage, attachedFiles, ticket.status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const validFiles = imageFiles.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit per file
      
      // Check current attachments count
      const currentCount = attachedFiles.length;
      const newCount = validFiles.length;
      const totalCount = currentCount + newCount;
      
      if (imageFiles.length !== files.length) {
        alert("Seules les images sont autorisées.");
      }
      if (validFiles.length !== imageFiles.length) {
        alert("Certaines images dépassent la taille limite de 5MB et n'ont pas été ajoutées.");
      }
      
      if (totalCount > 5) {
        const allowedCount = 5 - currentCount;
        if (allowedCount > 0) {
          alert(`Vous ne pouvez joindre que ${allowedCount} image(s) supplémentaire(s). Maximum 5 images autorisées.`);
          setAttachedFiles(prevFiles => [...prevFiles, ...validFiles.slice(0, allowedCount)]);
        } else {
          alert("Vous avez déjà atteint la limite de 5 images. Supprimez une image avant d'en ajouter une nouvelle.");
        }
      } else {
        setAttachedFiles(prevFiles => [...prevFiles, ...validFiles]);
      }
      
      e.target.value = ''; // Reset file input to allow selecting the same file again
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handlePreviewFile = (file: { name: string; size: string; type: string }) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const generateSecurePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  };

  const handlePasswordShare = () => {
    setPassword('');
    setShowPasswordModal(true);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const sendPasswordMessage = () => {
    if (!password.trim()) return;
    
    const message: Message = {
      id: String(Date.now()),
      sender: 'User',
      content: `🔐 Mot de passe partagé de manière sécurisée:\n\n${password}\n\n⚠️ Ce mot de passe est temporaire et sera automatiquement supprimé après 24h.`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prevMessages => [...prevMessages, message]);
    setShowPasswordModal(false);
    setPassword('');
    setShowPassword(false);
  };

  const generateNewPassword = () => {
    const newPassword = generateSecurePassword();
    setPassword(newPassword);
  };

  const getStatusInfo = useCallback((status: Ticket['status']) => {
    switch (status) {
      case 'Open': return { label: 'Ouvert', color: 'bg-red-100 text-red-800 border-red-200', icon: <AlertCircle className="w-4 h-4" /> };
      case 'Answered': return { label: 'Répondu', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle className="w-4 h-4" /> };
      case 'Pending': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-4 h-4" /> };
      case 'Closed': return { label: 'Fermé', color: 'bg-gray-200 text-gray-700 border-gray-300', icon: <XCircle className="w-4 h-4" /> };
      default: return { label: status, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <AlertCircle className="w-4 h-4" /> };
    }
  }, []);

   const getPriorityInfo = useCallback((priority: Ticket['priority']) => {
    switch (priority) {
      case 'High': return { label: 'Haute', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'Medium': return { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'Low': return { label: 'Basse', color: 'bg-green-100 text-green-800 border-green-200' };
      default: return { label: priority, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  }, []);

  const getChatTypeInfo = useCallback((chatType: Ticket['chatType']) => {
    switch (chatType) {
      case 'live': return { 
        label: 'Live Chat', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <Zap className="w-3 h-3" /> 
      };
      case 'classic': return { 
        label: 'Ticket Classique', 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <MessageSquare className="w-3 h-3" /> 
      };
      default: return { 
        label: chatType, 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: <MessageSquare className="w-3 h-3" /> 
      };
    }
  }, []);

  const handleMarkAsCompleted = useCallback(() => {
    console.log(`Marking ticket ${ticket.id} as Closed.`);
    setTicket(prevTicket => ({ ...prevTicket, status: 'Closed' }));
  }, [ticket.id]);

  const statusInfo = getStatusInfo(ticket.status);
  const priorityInfo = getPriorityInfo(ticket.priority);
  const chatTypeInfo = getChatTypeInfo(ticket.chatType);

  // Determine if the send button should be enabled
  const canSend = (newMessage.trim().length > 0 || attachedFiles.length > 0) && !isSending && ticket.status !== 'Closed';

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      {/* Header - Apple-style with glassmorphism */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-16 z-20 shadow-sm">
        {/* Mobile: Two-row layout for better usability */}
        <div className="block sm:hidden">
          {/* Top row: Back button + Essential info */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onBack}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 p-2 rounded-xl hover:bg-gray-100/80 active:scale-95"
              aria-label="Retour aux tickets"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg text-xs">
                <span className="text-gray-500 font-medium">ID:</span>
                <span className="font-semibold text-gray-700">{ticket.id}</span>
              </div>
            </div>
          </div>
          
          {/* Bottom row: Status tags + Assignee + Action */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-medium border ${statusInfo.color} shadow-sm flex-shrink-0`} title={statusInfo.label}>
                {statusInfo.icon}
              </div>
              
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-medium border ${chatTypeInfo.color} shadow-sm flex-shrink-0`} title={chatTypeInfo.label}>
                {chatTypeInfo.icon}
              </div>
              
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-medium border ${priorityInfo.color} shadow-sm flex-shrink-0`} title={`Priorité: ${priorityInfo.label}`}>
                <span className="text-xs font-bold">P</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center space-x-1 bg-gray-50/80 px-2 py-1 rounded-xl border border-gray-200/50 text-xs backdrop-blur-sm">
                <span className="font-medium text-gray-500">Assigné:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[60px]">{ticket.assignee || 'Non assigné'}</span>
              </div>
              
              {ticket.status === 'Answered' && (
                <button
                  onClick={handleMarkAsCompleted}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  aria-label="Marquer comme terminé"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>Terminé</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: Single line layout */}
        <div className="hidden sm:flex items-center justify-between gap-4 overflow-x-auto">
          {/* Left side: Back button + Info/Tags */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 p-2 rounded-xl hover:bg-gray-100/80 active:scale-95 flex-shrink-0"
              aria-label="Retour aux tickets"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">Retour</span>
            </button>
            
            {/* Info and Tags */}
            <div className="flex items-center gap-2 text-sm flex-wrap min-w-0">
              <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-lg text-xs flex-shrink-0">
                <span className="text-gray-500 font-medium">ID:</span>
                <span className="font-semibold text-gray-700">{ticket.id}</span>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-medium border ${statusInfo.color} shadow-sm flex-shrink-0`}>
                {statusInfo.icon}
                {statusInfo.label}
              </div>
              
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-medium border ${chatTypeInfo.color} shadow-sm flex-shrink-0`}>
                {chatTypeInfo.icon}
                {chatTypeInfo.label}
              </div>
              
              <div className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-medium border ${priorityInfo.color} shadow-sm flex-shrink-0`}>
                Priorité: {priorityInfo.label}
              </div>
              
              <div className="flex items-center gap-2 text-sm flex-shrink-0">
                <span className="text-gray-500 font-medium">Catégorie:</span>
                <span className="font-semibold text-gray-700">{ticket.category}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm flex-shrink-0">
                <span className="text-gray-500 font-medium">Créé le:</span>
                <span className="font-semibold text-gray-700">{new Date(ticket.created).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* Right side: Assignee + Action buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center space-x-2 bg-gray-50/80 px-4 py-2 rounded-2xl border border-gray-200/50 text-xs backdrop-blur-sm">
              <span className="font-medium text-gray-500">Assigné:</span>
              <span className="font-semibold text-gray-800">{ticket.assignee || 'Non assigné'}</span>
            </div>
            
            {ticket.status === 'Answered' && (
              <button
                onClick={handleMarkAsCompleted}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white text-xs font-medium rounded-2xl hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                aria-label="Marquer comme terminé"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Marquer comme Terminé</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modern Chat Interface */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
          {/* Initial Description - Modern Card Style */}
          <div className="flex justify-end">
            <div className="flex items-start max-w-[95%] sm:max-w-[80%] space-x-2 sm:space-x-3 min-w-0">
              <div className="bg-gradient-to-br from-[#DC0032] to-[#B8002A] text-white p-4 sm:p-4 rounded-2xl rounded-br-md shadow-lg min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-sm font-semibold">Votre demande initiale</span>
                </div>
                <h2 className="text-base sm:text-base font-semibold mb-2 text-white">{ticket.subject}</h2>
                <p className="text-sm whitespace-pre-wrap leading-relaxed break-words break-all hyphens-auto overflow-wrap-anywhere word-break-break-word" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{ticket.description}</p>
                <div className="text-xs text-white/80 mt-3 text-right">
                  {new Date(ticket.created).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 shadow-sm" title="Vous">
                <User size={16} className="sm:hidden" />
                <User size={18} className="hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'Support' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex items-start max-w-[95%] sm:max-w-[80%] space-x-2 sm:space-x-3 min-w-0 ${message.sender === 'Support' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm ${
                  message.sender === 'Support' 
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' 
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                }`} title={message.sender === 'Support' ? 'Support' : 'Vous'}>
                  {message.sender === 'Support' ? <Headset size={16} className="sm:hidden" /> : <User size={16} className="sm:hidden" />}
                  {message.sender === 'Support' ? <Headset size={18} className="hidden sm:block" /> : <User size={18} className="hidden sm:block" />}
                </div>
                <div className={`group relative p-3 sm:p-4 rounded-2xl shadow-sm min-w-0 flex-1 ${
                  message.sender === 'Support'
                    ? 'bg-white border border-gray-100 rounded-bl-md text-gray-800'
                    : 'bg-gradient-to-br from-[#DC0032] to-[#B8002A] text-white rounded-br-md'
                }`}>
                  <p className="text-sm sm:text-sm whitespace-pre-wrap leading-relaxed break-words break-all hyphens-auto overflow-wrap-anywhere word-break-break-word" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className={`mt-3 flex flex-wrap gap-2 ${message.sender === 'Support' ? 'border-t border-gray-100 pt-3' : 'border-t border-white/20 pt-3'}`}>
                      {message.attachments.map((attachment, attachIndex) => (
                        <div
                          key={attachIndex}
                          className="inline-block"
                        >
                          {/* Image Preview Thumbnail */}
                          <div 
                            className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                            onClick={() => handlePreviewFile(attachment)}
                          >
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <Image className="w-8 h-8 text-blue-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Timestamp and read status */}
                  <div className={`flex items-center justify-between mt-2 ${
                    message.sender === 'Support' ? 'text-gray-400' : 'text-white/70'
                  }`}>
                    <span className="text-xs">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'User' && (
                      <div className="flex items-center gap-1">
                        {message.isRead ? (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start max-w-[95%] sm:max-w-[80%] space-x-2 sm:space-x-3 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                  <Headset size={16} className="sm:hidden" />
                  <Headset size={18} className="hidden sm:block" />
                </div>
                <div className="bg-white border border-gray-100 p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-sm min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Support en train d'écrire...</p>
                </div>
              </div>
            </div>
          )}

          {/* Sending Indicator */}
          {isSending && (
            <div className="flex justify-end animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start max-w-[95%] sm:max-w-[80%] space-x-2 sm:space-x-3 flex-row-reverse min-w-0">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 flex items-center justify-center shadow-sm animate-pulse">
                  <User size={16} className="sm:hidden" />
                  <User size={18} className="hidden sm:block" />
                </div>
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-3 sm:p-4 rounded-2xl rounded-br-md shadow-sm animate-pulse min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Envoi en cours...</p>
                </div>
              </div>
            </div>
          )}

          {/* Closed Ticket Indicator */}
          {ticket.status === 'Closed' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-100 text-gray-600 text-sm border border-gray-200 shadow-sm">
                <XCircle className="w-5 h-5 text-gray-500" />
                <span>Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.</span>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Message Input Area */}
      <div className={`px-4 sm:px-6 py-4 sm:py-6 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 sticky bottom-0 shadow-2xl safe-area-pb ${ticket.status === 'Closed' ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Image Preview - Compact Style */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 p-3 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm max-h-25 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700">Images ({attachedFiles.length}/5)</p>
              <button
                onClick={() => setAttachedFiles([])}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors touch-manipulation px-1 py-0.5 rounded hover:bg-gray-100"
              >
                Tout supprimer
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {/* Image Thumbnail */}
                  <div 
                    className="w-12 h-12 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                    onClick={() => handlePreviewFile({ name: file.name, size: formatFileSize(file.size), type: file.type })}
                  >
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                      <Image className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 touch-manipulation opacity-0 group-hover:opacity-100"
                    aria-label={`Retirer ${file.name}`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Input Row - Modern Style */}
        <div className="flex items-end space-x-3 sm:space-x-4">
          {/* Modern Textarea Container */}
          <div className="flex-1 relative bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-[#DC0032] focus-within:shadow-lg">
            <textarea
              ref={textareaRef}
              rows={1}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                const newHeight = Math.min(target.scrollHeight, 120);
                target.style.height = `${newHeight}px`;
                
                // Ensure minimum height on mobile
                if (newHeight < 48) {
                  target.style.height = '48px';
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && canSend) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onFocus={() => {
                // Scroll to bottom when focusing on mobile
                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }}
              placeholder={ticket.status === 'Closed' ? "Ce ticket est fermé." : "Tapez votre message..."}
              className="w-full pl-4 sm:pl-4 pr-20 sm:pr-20 py-3 sm:py-3 border-none rounded-2xl resize-none text-sm max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-transparent placeholder:text-gray-400 focus:outline-none"
              disabled={isSending || ticket.status === 'Closed'}
              style={{ minHeight: '48px', height: '48px' }}
              aria-label="Zone de texte pour écrire un message"
            />
            
            {/* Action buttons */}
            <div className="absolute right-3 sm:right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-1">
              <button
                onClick={handlePasswordShare}
                className="p-2.5 sm:p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-[#DC0032] hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                aria-label="Partager un mot de passe de manière sécurisée"
                disabled={isSending || ticket.status === 'Closed'}
                title="Partager un mot de passe sécurisé"
              >
                <Shield className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>
              <label
                className={`p-2.5 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation ${
                  isSending || ticket.status === 'Closed' || attachedFiles.length >= 5
                    ? 'cursor-not-allowed text-gray-300' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer'
                }`}
                title={attachedFiles.length >= 5 ? "Limite de 5 images atteinte" : "Joindre une image (Max 5 images, 5MB chacune)"}
                aria-label="Joindre une image"
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSending || ticket.status === 'Closed' || attachedFiles.length >= 5}
                  accept="image/*"
                />
                <Paperclip className="w-4 h-4 sm:w-4 sm:h-4" />
              </label>
            </div>
          </div>
          
          {/* Modern Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!canSend}
            className={`h-[48px] sm:h-[48px] bg-gradient-to-r from-[#DC0032] to-[#B8002A] text-white rounded-2xl hover:from-[#c40029] hover:to-[#a60025] transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl touch-manipulation ${
              canSend ? 'opacity-100 hover:scale-105' : 'opacity-50 cursor-not-allowed'
            } ${isSending ? 'w-[48px] sm:w-[48px] px-0' : 'px-4 sm:px-6'}`}
            aria-label={isSending ? "Envoi en cours..." : "Envoyer le message"}
            aria-disabled={!canSend}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 sm:w-5 sm:h-5 hidden sm:inline-block mr-2" />
                <span className="font-semibold text-sm sm:text-base">Envoyer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Password Sharing Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Shield className="w-6 h-6 text-[#DC0032]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Partage sécurisé de mot de passe</h3>
                <p className="text-sm text-gray-500">Mettre un mot de passe temporaire sécurisé</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <button
                    onClick={generateNewPassword}
                    className="text-xs text-[#DC0032] hover:text-[#B8002A] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Key className="w-3 h-3" />
                    Générer automatiquement
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Saisissez votre mot de passe temporaire..."
                    className="w-full px-4 py-3 pr-20 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#DC0032] focus:border-transparent"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={copyPassword}
                      disabled={!password.trim()}
                      className="p-2 text-gray-400 hover:text-[#DC0032] rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Copier le mot de passe"
                    >
                      {passwordCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {passwordCopied && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Mot de passe copié dans le presse-papiers
                  </p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Key className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <p className="font-medium mb-1">⚠️ Important :</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Ce mot de passe est temporaire (24h)</li>
                      <li>• Il sera automatiquement supprimé</li>
                      <li>• Ne le partagez que via ce canal sécurisé</li>
                      <li>• Changez-le immédiatement après utilisation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setShowPassword(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={sendPasswordMessage}
                disabled={!password.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#DC0032] to-[#B8002A] hover:from-[#c40029] hover:to-[#a60025] rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer dans le chat
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Preview Modal */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setShowPreviewModal(false); setPreviewFile(null); }}>
          <div className="bg-white rounded-lg shadow-lg p-3 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded flex items-center justify-center mb-2">
                <Image className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-xs text-gray-600 mb-2">{previewFile.name}</p>
              <button
                onClick={() => { setShowPreviewModal(false); setPreviewFile(null); }}
                className="px-3 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
