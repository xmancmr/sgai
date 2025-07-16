import React from 'react';
import { DateRange } from 'react-day-picker';
import EnhancedInventory from './inventory/EnhancedInventory';

interface InventoryProps {
  dateRange?: DateRange;
  searchTerm?: string;
}

const Inventory: React.FC<InventoryProps> = ({ dateRange, searchTerm }) => {

  return (
    <EnhancedInventory dateRange={dateRange} searchTerm={searchTerm} />
  );
};

export default Inventory;
