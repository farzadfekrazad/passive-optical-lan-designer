
import React from 'react';
import type { PolDesignParameters, OltDevice } from '../types';
import OltIcon from './icons/OltIcon';
import SplitterIcon from './icons/SplitterIcon';
import OntIcon from './icons/OntIcon';
import ServerIcon from './icons/ServerIcon';

interface VisualizationPanelProps {
  parameters: PolDesignParameters;
  selectedOlt?: OltDevice;
}

const SPLITTER_LOSS_MAP: { [key: string]: number } = {
  '1:2': 3.5,
  '1:4': 7.5,
  '1:8': 10.5,
  '1:16': 13.8,
  '1:32': 17.2,
  '1:64': 20.5,
};

const FIBER_LOSS_PER_KM = 0.35; // at 1490nm for OS2

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ parameters, selectedOlt }) => {
  const { splitterConfig, expertMode } = parameters;

  const calculatePowerBudget = () => {
    const totalDistanceKm = (parameters.backboneDistance + parameters.dropCableLength) / 1000;
    const fiberLoss = totalDistanceKm * FIBER_LOSS_PER_KM;

    let splitterLoss = 0;
    if (splitterConfig.type === 'Centralized') {
        splitterLoss = SPLITTER_LOSS_MAP[splitterConfig.level1Ratio] || 0;
    } else { // Cascaded
        splitterLoss = (SPLITTER_LOSS_MAP[splitterConfig.level1Ratio] || 0) + (SPLITTER_LOSS_MAP[splitterConfig.level2Ratio] || 0);
    }
    
    // Expert mode uses separate splice counts, otherwise uses a total of 4 (2 backbone, 2 drop)
    const totalSplices = expertMode ? (parameters.backboneSplices + parameters.dropSplices) : 4;
    const spliceLossTotal = totalSplices * parameters.spliceLoss;

    // Connector loss is fixed at 2 for simplicity in non-expert mode
    const totalConnectors = expertMode ? (parameters.backboneSplices + parameters.dropSplices) : 2;
    const connectorLossTotal = totalConnectors * parameters.connectorLoss;

    const safetyMargin = expertMode ? parameters.safetyMargin : 0;
    
    const totalLoss = fiberLoss + splitterLoss + connectorLossTotal + spliceLossTotal + safetyMargin;
    const receivedPower = parameters.oltTxPower - totalLoss;
    const powerMargin = receivedPower - parameters.ontRxSensitivity;
    
    return { totalLoss, powerMargin, receivedPower };
  };

  const { totalLoss, powerMargin, receivedPower } = calculatePowerBudget();
  
  const getMarginColor = () => {
    if (powerMargin < 0) return 'text-red-500';
    if (powerMargin < 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const ontsToDisplay = Math.min(parameters.ontsPerPonPort, 8); // Display max 8 for visual clarity

  const renderSplitter = (ratio: string, label: string) => (
    <div className="flex flex-col items-center text-center">
        <SplitterIcon className="w-12 h-12 text-yellow-400" />
        <p className="text-sm font-semibold mt-2">{label}</p>
        <p className="text-xs text-gray-400">{ratio}</p>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-gray-700 pb-2">Network Visualization & Power Budget</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-900/50 p-4 rounded-md">
        <div className="text-center">
          <p className="text-sm text-gray-400">OLT TX Power</p>
          <p className="text-lg font-semibold text-cyan-300">{parameters.oltTxPower.toFixed(1)} dBm</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Total Loss</p>
          <p className="text-lg font-semibold text-red-400">{totalLoss.toFixed(2)} dB</p>
        </div>
         <div className="text-center">
          <p className="text-sm text-gray-400">Est. Power at ONT</p>
          <p className="text-lg font-semibold text-cyan-300">{receivedPower.toFixed(2)} dBm</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Power Margin</p>
          <p className={`text-2xl font-bold ${getMarginColor()}`}>{powerMargin.toFixed(2)} dB</p>
        </div>
      </div>
      
      {/* Visualization */}
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="w-full flex items-center">
          {/* Uplink/Core */}
          <div className="flex flex-col items-center gap-2 pr-4 text-center">
              <ServerIcon className="w-12 h-12 text-gray-400" />
              <p className="text-xs text-gray-500">Core Network</p>
              <div className="text-xs font-mono">
                {selectedOlt?.uplinkPorts.map(p => <div key={p.type}>{p.count}x {p.type}</div>)}
              </div>
          </div>
          <div className="w-16 border-t-2 border-dashed border-gray-600"></div>

          {/* OLT */}
          <div className="flex flex-col items-center text-center">
            <OltIcon className="w-16 h-16 text-cyan-500" />
            <p className="text-sm font-semibold mt-2">{selectedOlt?.model || 'OLT'}</p>
            <p className="text-xs text-gray-400">{parameters.ponPorts} Ports ({parameters.sfpSelection})</p>
          </div>

          {/* Backbone Fiber */}
          <div className="flex-1 h-2 bg-gradient-to-r from-cyan-500 to-cyan-700 mx-2 rounded-full relative">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-700 px-2 py-0.5 rounded text-xs whitespace-nowrap">{parameters.backboneDistance}m Backbone</span>
          </div>

          {/* Splitter(s) */}
          {splitterConfig.type === 'Centralized' ? (
              renderSplitter(splitterConfig.level1Ratio, 'Splitter')
          ) : (
              <>
                {renderSplitter(splitterConfig.level1Ratio, 'Splitter L1')}
                <div className="flex-1 h-0.5 bg-yellow-400 mx-2"></div>
                {renderSplitter(splitterConfig.level2Ratio, 'Splitter L2')}
              </>
          )}

          {/* Splitter to ONT paths */}
          <div className="flex-1 flex flex-col justify-center items-end pl-2 relative">
             <div className="w-full h-0.5 bg-yellow-400 absolute left-0 top-1/2 -translate-y-1/2"></div>
             <div className="w-0.5 h-full bg-yellow-400 absolute left-2 top-0"></div>

             {Array.from({ length: ontsToDisplay }).map((_, i) => (
                 <div key={i} className={`h-full w-full relative ${i > 0 ? 'mt-2':''}`}>
                     <div style={{width: `${(i + 1) * (100 / (ontsToDisplay+1))}%`}} className="h-0.5 bg-yellow-400 absolute top-1/2 -translate-y-1/2 right-0"></div>
                 </div>
             ))}
          </div>

          {/* ONTs */}
          <div className="flex flex-col space-y-3 pl-2">
            {Array.from({ length: ontsToDisplay }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-1 h-0.5 bg-yellow-400"></div>
                <OntIcon className="w-8 h-8 text-green-400 ml-2" />
              </div>
            ))}
             {parameters.ontsPerPonPort > ontsToDisplay && (
                <div className="text-center text-xs text-gray-500">
                    ... and {parameters.ontsPerPonPort - ontsToDisplay} more
                </div>
             )}
          </div>
        </div>
      </div>
       {powerMargin < 0 && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-center">
          <p className="font-bold text-red-400">Warning: Negative Power Margin</p>
          <p className="text-sm text-red-300">The design is not viable. The signal is too weak to reach the ONT. Reduce losses or select a stronger SFP module.</p>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;
