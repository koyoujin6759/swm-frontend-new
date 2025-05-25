import { StudyFilterProps } from "@/types/filters/study-filter";
import FilterText from "@/components/ui/FilterText";

export default function SortFilter({type,onChange,defaultValue,options,isOpen,onToggle,filterName}: StudyFilterProps) {
    return <div>
        <FilterText type={type as "default"} onChange={onChange} defaultValue={defaultValue} options={options} isOpen={isOpen} onToggle={onToggle} filterName={filterName}  />
    </div>
}