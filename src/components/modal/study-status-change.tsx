import { useState } from 'react';
import {
  StudyStatus,
  STATUS_LABELS,
} from '@/types/api/study-recruit/study';
import StudyEditModal from './study-edit-modal';
export default function StudyStatusChange({
  handleCloseModal,
  defaultValue,
  options,
  onClickOption, 
}: {
  handleCloseModal: () => void;
  defaultValue: string;
  options: string[];
  onClickOption: (value: string) => void; 
}) {
  const handleConfirm = () => {
    handleCloseModal();
    onClickOption(selectedStatus || defaultValue);
    // console.log('selectedStatus', selectedStatus);
  };

  const [selectedStatus, setSelectedStatus] = useState(defaultValue || '');

  const onChangeStatus = (value: string) => {
    // console.log('value', value);
    setSelectedStatus(value);
  };

  const statusList = options
    ?.filter((option) => option !== 'ALL')
    .map((status) => ({
      value: status,
      label: STATUS_LABELS[status as keyof typeof StudyStatus],
    }));   

  return (
    <>
      <StudyEditModal
        title="스터디 모집 상태를 변경합니다."
        handleCloseModal={handleCloseModal}
        defaultValue={selectedStatus}
        options={statusList || []}
        onClickOption={onChangeStatus}
        handleConfirm={handleConfirm}
      />
    </>
  );
}
