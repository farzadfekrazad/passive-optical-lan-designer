
import React from 'react';
import type { SplitterConfig, SplitRatio } from '../types';

interface SplitterConfigProps {
    config: SplitterConfig;
    onChange: (config: SplitterConfig) => void;
}

const RATIO_OPTIONS: SplitRatio[] = ['1:2', '1:4', '1:8', '1:16', '1:32', '1:64'];

const SplitterConfig: React.FC<SplitterConfigProps> = ({ config, onChange }) => {

    const handleTypeChange = (newType: 'Centralized' | 'Cascaded') => {
        onChange({ ...config, type: newType });
    };

    const handleRatioChange = (level: 'level1Ratio' | 'level2Ratio', value: SplitRatio) => {
        onChange({ ...config, [level]: value });
    };

    const totalRatio = config.type === 'Centralized'
        ? parseInt(config.level1Ratio.split(':')[1])
        : parseInt(config.level1Ratio.split(':')[1]) * parseInt(config.level2Ratio.split(':')[1]);
    
    const isValid = totalRatio <= 128; // Common PON limitation

    return (
        <div className="space-y-3 p-3 bg-gray-900/50 rounded-md">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-400 mb-1">Splitter Architecture</label>
                <div className="flex rounded-md bg-gray-700 p-1 text-sm">
                    <button 
                        type="button"
                        onClick={() => handleTypeChange('Centralized')}
                        className={`px-3 py-1 rounded-md ${config.type === 'Centralized' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
                    >
                        Centralized
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleTypeChange('Cascaded')}
                        className={`px-3 py-1 rounded-md ${config.type === 'Cascaded' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
                    >
                        Cascaded
                    </button>
                </div>
            </div>

            {config.type === 'Centralized' ? (
                <select
                    value={config.level1Ratio}
                    onChange={e => handleRatioChange('level1Ratio', e.target.value as SplitRatio)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    {RATIO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-400">Level 1 Split</label>
                         <select
                            value={config.level1Ratio}
                            onChange={e => handleRatioChange('level1Ratio', e.target.value as SplitRatio)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            {RATIO_OPTIONS.slice(0, 4).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Level 2 Split</label>
                         <select
                            value={config.level2Ratio}
                            onChange={e => handleRatioChange('level2Ratio', e.target.value as SplitRatio)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            {RATIO_OPTIONS.slice(0, 5).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
            )}
            <div className={`text-right text-sm font-semibold ${isValid ? 'text-gray-400' : 'text-red-500'}`}>
                Total Split Ratio: 1:{totalRatio} { !isValid && "(Invalid)"}
            </div>
        </div>
    );
};

export default SplitterConfig;
