export interface StudyFilterProps {
    type: string | null;
    onChange: (value: string | string[]) => void;
    defaultValue: string | string[];
    options: { id: number; value: string; label: string }[];
    isOpen: boolean;
    onToggle: () => void; 
    filterName?: string;
}
