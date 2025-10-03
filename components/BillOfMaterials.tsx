
import React from 'react';
import type { PolDesignParameters, OltDevice, OntDevice } from '../types';

interface BillOfMaterialsProps {
  parameters: PolDesignParameters;
  selectedOlt?: OltDevice;
  selectedOnt?: OntDevice;
}

const BillOfMaterials: React.FC<BillOfMaterialsProps> = ({ parameters, selectedOlt, selectedOnt }) => {
  if (!selectedOlt || !selectedOnt) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Bill of Materials</h2>
        <p className="text-gray-400">Select an OLT and ONT to generate the materials list.</p>
      </div>
    );
  }
  
  const totalOnts = parameters.ponPorts * parameters.ontsPerPonPort;
  const totalFiberLength = (parameters.backboneDistance * parameters.ponPorts) + (parameters.dropCableLength * totalOnts);

  const splitterItems = () => {
    if (parameters.splitterConfig.type === 'Centralized') {
        const ratio = parseInt(parameters.splitterConfig.level1Ratio.split(':')[1]);
        const count = Math.ceil(totalOnts / ratio);
        return [{ name: `PLC Splitter ${parameters.splitterConfig.level1Ratio}`, quantity: count }];
    } else { // Cascaded
        const l1Ratio = parseInt(parameters.splitterConfig.level1Ratio.split(':')[1]);
        const l2Ratio = parseInt(parameters.splitterConfig.level2Ratio.split(':')[1]);
        const totalSplit = l1Ratio * l2Ratio;
        if (totalSplit === 0) return [];
        const l1Count = Math.ceil(totalOnts / totalSplit);
        const l2Count = l1Count * l1Ratio;
        return [
            { name: `PLC Splitter ${parameters.splitterConfig.level1Ratio} (L1)`, quantity: l1Count },
            { name: `PLC Splitter ${parameters.splitterConfig.level2Ratio} (L2)`, quantity: l2Count }
        ];
    }
  };
  
  const bomItems = [
    // OLT and its components
    ...(selectedOlt.components.length > 0 
        ? selectedOlt.components 
        : [{ name: selectedOlt.model, quantity: 1}]
    ),
    // SFP Modules
    { name: `PON SFP Module: ${parameters.sfpSelection}`, quantity: parameters.ponPorts },
    // Uplink Modules
    ...selectedOlt.uplinkPorts.map(p => ({name: `Uplink Module: ${p.type}`, quantity: p.count})),
    // Splitters
    ...splitterItems(),
    // ONTs
    { name: `ONT: ${selectedOnt.model}`, quantity: totalOnts },
    // Fiber Cable
    { name: `Singlemode OS2 Fiber Cable`, quantity: `${(totalFiberLength / 1000).toFixed(2)} km` },
  ];
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col" id="bom-panel">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">Bill of Materials</h2>
        <button 
          onClick={handlePrint} 
          className="print-hide bg-gray-700 text-cyan-300 hover:bg-gray-600 font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Print
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-2">Item</th>
              <th scope="col" className="px-4 py-2 text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {bomItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className="px-4 py-2 text-right font-mono">{String(item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            <p><strong>Total PON Ports Utilized:</strong> {parameters.ponPorts}</p>
            <p><strong>Total ONTs Deployed:</strong> {totalOnts}</p>
            <p><strong>Note:</strong> Quantities are estimates. Fiber length includes backbone runs per PON port plus individual drops. Verify all quantities before ordering.</p>
        </div>
    </div>
  );
};

export default BillOfMaterials;
