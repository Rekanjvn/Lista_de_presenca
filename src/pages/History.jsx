import React from 'react';
import HistoryView from '../components/HistoryView';

const History = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Histórico de Aulas</h1>
      <HistoryView />
    </div>
  );
};

export default History;