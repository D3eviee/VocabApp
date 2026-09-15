import { StoryboardItem } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type StoryboardMenuItemProps = {
  storyboardItem: StoryboardItem;
  isActive: boolean;
  onSelect: () => void;
}

export const StoryboardMenuItem = ({ storyboardItem, isActive, onSelect }: StoryboardMenuItemProps) => {
  const { attributes,listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: storyboardItem.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 2,};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group w-full px-6 py-4 flex flex-row items-center  rounded-3xl transition-all duration-200 cursor-pointer 
        ${isActive ? 'bg-button-background' : 'hover:bg-button-background'} 
        ${isDragging ? 'opacity-50 scale-95 shadow-md border-[0.5px] border-button-secondary' : 'opacity-100'}
      `}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()} 
        className={`p-1.5 rounded-xl cursor-grab active:cursor-grabbing transition-colors mr-2
          ${ isActive ? 'text-gradient-start' : ' text-subheading'
        }`}
      >
        <GripVertical size={18} strokeWidth={2}/>
      </div>

      <div className="flex-1 min-w-0">        
        <p className={`text-15 font-semibold truncate mb-0.5 ${isActive ? 'text-gradient-start' : 'text-main-dark'}`}>{storyboardItem.title}</p>
        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-gradient-start' : 'text-subheading'}`}>{storyboardItem.description || 'No description...'}</p>
      </div>
    </div>
  );
}