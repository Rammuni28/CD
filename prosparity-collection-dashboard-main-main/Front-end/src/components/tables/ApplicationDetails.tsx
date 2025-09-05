import { memo } from "react";
import { Application } from "@/types/application";
import { formatEmiMonth, formatCurrency } from "@/utils/formatters";

interface ApplicationDetailsProps {
  application: Application;
}

const formatLenderName = (lenderName: string) => {
  return lenderName === 'Vivriti Capital Limited' ? 'Vivriti' : lenderName;
};

const ApplicationDetails = memo(({ application }: ApplicationDetailsProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <div className="font-semibold text-blue-900">{application.applicant_name}</div>
        {application.vehicle_status && (
          <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            {application.vehicle_status}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">ID:</span> {application.applicant_id}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">EMI Month:</span> {formatEmiMonth(application.demand_date)} | 
        <span className="font-medium"> EMI Due:</span> {formatCurrency(application.emi_amount)}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Branch:</span> {application.branch_name}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">TL:</span> {application.team_lead} | 
        <span className="font-medium"> RM:</span> {application.rm_name}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Dealer:</span> {application.dealer_name} | 
        <span className="font-medium"> Lender:</span> {formatLenderName(application.lender_name)}
      </div>
    </div>
  );
});

ApplicationDetails.displayName = "ApplicationDetails";

export default ApplicationDetails;
