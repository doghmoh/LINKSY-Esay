export interface MessageStats {
  characters: number;
  parts: number;
  encoding: string;
}

export function calculateMessageStats(message: string): MessageStats {
  const hasSpecialChars = /[^\u0000-\u007F]/.test(message);
  const encoding = hasSpecialChars ? 'Unicode (UTF-8)' : 'GSM 7-bit';
  const charsPerMessage = hasSpecialChars ? 70 : 160;
  
  return {
    characters: message.length,
    parts: Math.max(1, Math.ceil(message.length / charsPerMessage)),
    encoding
  };
}
