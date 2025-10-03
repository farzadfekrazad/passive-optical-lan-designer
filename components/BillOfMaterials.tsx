import React from 'react';
import type { PolDesignParameters, OltDevice, OntDevice } from '../types';
import { useI18n } from '../contexts/I18nContext';

interface BillOfMaterialsProps {
  parameters: PolDesignParameters;
  selectedOlt?: OltDevice;
  selectedOnt?: OntDevice;
}

const BillOfMaterials: React.FC<BillOfMaterialsProps> = ({ parameters, selectedOlt, selectedOnt }) => {
  const { t } = useI18n();

  if (!selectedOlt || !selectedOnt) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">{t('bom.title')}</h2>
        <p className="text-gray-400">{t('bom.selectOltOnt')}</p>
      </div>
    );
  }
  
  const totalOnts = parameters.ponPorts * parameters.ontsPerPonPort;
  const totalFiberLength = (parameters.backboneDistance * parameters.ponPorts) + (parameters.dropCableLength * totalOnts);

  const splitterItems = () => {
    if (parameters.splitterConfig.type === 'Centralized') {
        const ratio = parseInt(parameters.splitterConfig.level1Ratio.split(':')[1]);
        const count = Math.ceil(totalOnts / ratio);
        return [{ name: t('bom.splitterCentral', { ratio: parameters.splitterConfig.level1Ratio }), quantity: count }];
    } else { // Cascaded
        const l1Ratio = parseInt(parameters.splitterConfig.level1Ratio.split(':')[1]);
        const l2Ratio = parseInt(parameters.splitterConfig.level2Ratio.split(':')[1]);
        const totalSplit = l1Ratio * l2Ratio;
        if (totalSplit === 0) return [];
        const l1Count = Math.ceil(totalOnts / totalSplit);
        const l2Count = l1Count * l1Ratio;
        return [
            { name: t('bom.splitterL1', { ratio: parameters.splitterConfig.level1Ratio }), quantity: l1Count },
            { name: t('bom.splitterL2', { ratio: parameters.splitterConfig.level2Ratio }), quantity: l2Count }
        ];
    }
  };
  
  const bomItems = [
    ...(selectedOlt.components.length > 0 
        ? selectedOlt.components 
        : [{ name: selectedOlt.model, quantity: 1}]
    ),
    { name: t('bom.sfpModule', { name: parameters.sfpSelection }), quantity: parameters.ponPorts },
    ...selectedOlt.uplinkPorts.map(p => ({name: t('bom.uplinkModule', { type: p.type }), quantity: p.count})),
    ...splitterItems(),
    { name: t('bom.ont', { model: selectedOnt.model }), quantity: totalOnts },
    { name: t('bom.fiberCable'), quantity: `${(totalFiberLength / 1000).toFixed(2)} km` },
  ];
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col" id="bom-panel">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">{t('bom.title')}</h2>
        <button 
          onClick={handlePrint} 
          className="print-hide bg-gray-700 text-cyan-300 hover:bg-gray-600 font-semibold py-2 px-4 rounded-md transition-colors"
        >
          {t('bom.print')}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <table className="w-full text-sm text-start text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-2">{t('bom.item')}</th>
              <th scope="col" className="px-4 py-2 text-end">{t('bom.quantity')}</th>
            </tr>
          </thead>
          <tbody>
            {bomItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className="px-4 py-2 text-end font-mono">{String(item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            <p><strong>{t('bom.totalPonPorts')}:</strong> {parameters.ponPorts}</p>
            <p><strong>{t('bom.totalOnts')}:</strong> {totalOnts}</p>
            <p>{t('bom.disclaimer')}</p>
        </div>
    </div>
  );
};

export default BillOfMaterials;