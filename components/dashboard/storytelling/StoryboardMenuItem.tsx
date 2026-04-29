"use client";
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const  StoryboardMenuItem = ({ part, index, isActive, onSelect }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: part.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const title = part.front?.trim() ? part.front : `Part ${index + 1}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-2 p-2 rounded-2xl border transition-colors duration-200
        ${isActive ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-200'}
      `}
    >
      {/* 1. UCHWYT DO PRZECIĄGANIA (Grip) */}
      <div 
        {...attributes} 
        {...listeners} 
        className="p-1.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing rounded-lg hover:bg-gray-100 transition-colors"
      >
        <GripVertical size={16} />
      </div>

      {/* KLIKALNY OBSZAR (Zaznaczanie elementu) */}
      <div onClick={() => onSelect(part.id)} className="flex flex-1 items-center gap-3 cursor-pointer overflow-hidden py-1 pr-2">
        <div className={`
          flex items-center justify-center w-7 h-7 rounded-xl shrink-0 text-sm font-bold transition-colors
          ${isActive ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200' : 'bg-white border border-gray-200 text-gray-500 group-hover:border-gray-300'}
        `}>
          {index + 1}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-indigo-900' : 'text-gray-700'}`}>
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}