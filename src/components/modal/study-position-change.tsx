import { useState } from 'react';
import {
  POSITION_LABELS,
  RecruitmentPositionTitle,
} from '@/types/api/study-recruit/study';
import StudyEditModal from './study-edit-modal';
export default function StudyPositionChange({
  handleCloseModal,
  defaultValue,
  position,
  onClickOption, 
}: {
  handleCloseModal: () => void;
  defaultValue: string;
  position: string[] | undefined;
  onClickOption: (value: string) => void; 
}) {
  const handleConfirm = () => {
    // handleCloseModal();
    onClickOption(selectedPosition || defaultValue);
    // console.log('selectedPosition', selectedPosition);
  };

  const [selectedPosition, setSelectedPosition] = useState(defaultValue || '');

  const onChangePosition = (value: string) => {
    // console.log('value', value);
    setSelectedPosition(value);
  };

  const positionList = position
    ?.filter((option) => option !== 'ALL')
    .map((pos) => ({
      value: pos,
      label: POSITION_LABELS[pos as keyof typeof RecruitmentPositionTitle] + ' 직무',
    }));
  // console.log('positionList', positionList);

  return (
    <>
      <StudyEditModal
        title="신청 포지션을 변경합니다."
        handleCloseModal={handleCloseModal}
        defaultValue={selectedPosition}
        options={positionList || []}
        onClickOption={onChangePosition}
        handleConfirm={handleConfirm}
      />
    </>
  );
}
