import { Bin, getStateLabel, formatBinDate } from '../types/bin';

interface BinCardProps {
  bin: Bin;
}

export function BinCard({ bin }: BinCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{bin.name}</h3>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">State:</span>
          <span className={`font-medium ${
            bin.state === 'Empty' ? 'text-gray-500' :
            bin.state === 'In Use' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {getStateLabel(bin.state)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">In Use Since:</span>
          <span className="text-gray-700">{formatBinDate(bin.inUseStartDate)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Fermenting Since:</span>
          <span className="text-gray-700">{formatBinDate(bin.fermentingStartDate)}</span>
        </div>
      </div>
    </div>
  );
}
