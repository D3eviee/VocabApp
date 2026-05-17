import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type StoryboardMenuItemProps = {
  part: any;
  index: number;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const StoryboardMenuItem = ({ part, isActive, onSelect }: StoryboardMenuItemProps) => {
  const { attributes,listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: part.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1,};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center p-3  transition-all ${isActive ? 'hover:bg-transparent' : 'hover:bg-red'
      } ${isDragging ? 'opacity-50 scale-[1.02] shadow-md border-gray-200' : 'opacity-100'}`}
      onClick={() => onSelect(part.id)}
    >
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()} 
        className={`p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-colors mr-2 
          ${ isActive ? 'text-[#4F39F6] hover:bg-blue-100' : 'text-gray-300 hover:bg-gray-200 hover:text-[#4F39F6]'
        }`}
      >
        <GripVertical size={16} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">        
        <h3 className={`text-sm font-bold truncate mb-0.5 ${ isActive ? 'text-[#4F39F6]' : 'text-[#111]'}`}>{part.title || 'Untitled Event'}</h3>
        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-[#5F4AF7]' : 'text-[#494949]'}`}>{part.description || 'No description...'}</p>
      </div>
    </div>
  );
}