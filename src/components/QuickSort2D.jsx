import React from 'react';
import ArrayVisualizer from '../components/ArrayVisualizer';

const QuickSort2D = ({ currentStep }) => {
    if (!currentStep) return null;
    const { array = [], active = [], swapped = false } = currentStep;
    const values = array.map(item => item.value);
    const swappedIndices = swapped ? active : [];
    return (
        <div className="w-full h-[400px] flex items-center justify-center">
            <ArrayVisualizer
                array={values}
                activeIndices={active}
                swappedIndices={swappedIndices}
                maxValue={Math.max(...values, 100)}
            />
        </div>
    );
};

export default QuickSort2D;
