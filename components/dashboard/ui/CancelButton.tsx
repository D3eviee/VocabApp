"use client";

export const CancelButton = ({ onClose }:{onClose: () => void;}) => {
    return (
        <button
            onClick={() => onClose()}
            type="button"
            className={`bg-[#F2F2F2] border border-light-border shadow-2xs shadow-gray-200 w-full flex items-center justify-center font-semibold text-subheading py-3 rounded-2xl text-sm cursor-pointer hover:bg-[#E3E3E3] active:scale-95 transition-all duration-75`}
        >
            Cancel
        </button>
    );
}
