import { useState } from 'react';

const useToggleHeatmapPreview = () => {
  const [showHeatmapPreview, setShowHeatmapPreview] = useState(true);

  const handleToggle = () => {
    setShowHeatmapPreview((prev) => !prev);
  };

  return { show: showHeatmapPreview, handleToggle };
};

export default useToggleHeatmapPreview;
