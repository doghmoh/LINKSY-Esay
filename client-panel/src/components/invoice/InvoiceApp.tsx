import React from 'react';

interface InvoiceAppProps {
  activeTab: string;
}

const InvoiceApp: React.FC<InvoiceAppProps> = ({ activeTab }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Invoice App</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'invoices' && (
          <div>
            <p>Invoice list will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceApp;
