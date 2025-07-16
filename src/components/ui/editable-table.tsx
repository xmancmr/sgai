
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Edit, Save, X, Trash2, Plus, ArrowUpDown } from 'lucide-react';

export interface Column {
  id: string;
  header: string;
  accessorKey: string;
  isEditable?: boolean;
  customRender?: (value: any) => React.ReactNode;
  type?: string;
  width?: string;
  options?: string[];
}

interface EditableTableProps<T extends object> {
  data: T[];
  columns: Column[];
  onUpdate?: (rowIndex: number, columnId: string, value: any) => void;
  onDelete?: (rowIndex: number) => void;
  onAdd?: (newRow?: Record<string, any>) => void;
  sortable?: boolean;
  className?: string;
  actions?: {
    icon: React.ReactNode;
    label: string;
    onClick: (rowIndex: number) => void;
  }[];
}

export function EditableTable<T extends object>({
  data,
  columns,
  onUpdate,
  onDelete,
  onAdd,
  sortable = false,
  className = "",
  actions = []
}: EditableTableProps<T>) {
  const [editRows, setEditRows] = useState<Record<number, boolean>>({});
  const [sortColumn, setSortColumn] = useState<{ id: string; direction: 'asc' | 'desc' } | null>(null);

  const toggleEditRow = (index: number) => {
    setEditRows(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSave = (index: number) => {
    toggleEditRow(index);
  };

  const handleChange = (index: number, columnId: string, value: any) => {
    if (onUpdate) {
      onUpdate(index, columnId, value);
    }
  };

  const handleDelete = (index: number) => {
    if (onDelete) {
      onDelete(index);
    }
  };

  const handleSort = (columnId: string) => {
    if (!sortable) return;

    setSortColumn(prev => {
      if (prev && prev.id === columnId) {
        return {
          id: columnId,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        return {
          id: columnId,
          direction: 'asc'
        };
      }
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    const { id, direction } = sortColumn;
    const column = columns.find(col => col.id === id);

    if (!column) return data;

    return [...data].sort((a, b) => {
      const valueA = (a as any)[column.accessorKey];
      const valueB = (b as any)[column.accessorKey];

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, columns]);

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead 
                key={column.id} 
                onClick={sortable ? () => handleSort(column.id) : undefined} 
                className={sortable ? "cursor-pointer" : ""}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
                {sortable && sortColumn?.id === column.id && (
                  <ArrowUpDown className="ml-2 inline-block h-4 w-4" />
                )}
              </TableHead>
            ))}
            {(onDelete || actions.length > 0) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column.id}>
                  {column.isEditable && editRows[index] ? (
                    column.id === 'notes' || column.type === 'textarea' ? (
                      <Textarea
                        value={(row as any)[column.accessorKey]}
                        onChange={e => handleChange(index, column.accessorKey, e.target.value)}
                        className="w-full"
                      />
                    ) : column.type === 'select' && column.options ? (
                      <select
                        value={(row as any)[column.accessorKey]}
                        onChange={e => handleChange(index, column.accessorKey, e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        {column.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        defaultValue={(row as any)[column.accessorKey]}
                        onChange={e => handleChange(index, column.accessorKey, e.target.value)}
                        className="w-full"
                        type={column.type || 'text'}
                      />
                    )
                  ) : (
                    column.customRender ? column.customRender((row as any)[column.accessorKey]) : (row as any)[column.accessorKey]
                  )}
                </TableCell>
              ))}
              {(onDelete || actions.length > 0) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {actions.length > 0 &&
                      actions.map((action, actionIndex) => (
                        <Button key={actionIndex} variant="ghost" size="icon" onClick={() => action.onClick(index)}>
                          {action.icon}
                        </Button>
                      ))}
                    {onDelete && (
                      <>
                        {editRows[index] ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleSave(index)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleEditRow(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => toggleEditRow(index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {onAdd && (
        <div className="p-4">
          <Button onClick={() => onAdd()}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      )}
    </div>
  );
}
