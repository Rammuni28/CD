import { memo, useState, useEffect } from "react";
import { Application } from "@/types/application";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPtpDate, formatEmiMonth } from "@/utils/formatters";
import { Phone, Eye, Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentsService } from "@/integrations/api/services/commentsService";
import { COMMENT_TYPES } from "@/integrations/api/services/commentsService";
import CallButton from "../../CallButton";

// Mapping for demand_calling_status values to display labels
const PRE_EMI_STATUS_MAPPING = {
  "deposited in bank": "Deposited in Bank",
  "cash collected": "Cash Collected", 
  "ptp taken": "PTP Taken",
  "no response": "No Response",
  "no_response": "No Response",
  "noresponse": "No Response",
  "deposited_in_bank": "Deposited in Bank",
  "cash_collected": "Cash Collected",
  "ptp_taken": "PTP Taken",
  "1": "Deposited in Bank",
  "2": "Cash Collected",
  "3": "PTP Taken", 
  "4": "No Response"
};

const getPreEmiStatusLabel = (status: string | null | undefined) => {
  if (!status) return 'Not Set';
  return PRE_EMI_STATUS_MAPPING[status.toLowerCase()] || status;
};

interface MobileApplicationCardProps {
  application: Application;
  onRowClick: (application: Application) => void;
  selectedApplicationId?: string;
  selectedMonth: string;
}

const getStatusColor = (status: string) => {
  const variants = {
    'Unpaid': 'bg-red-100 text-red-800 border-red-200',
    'Partially Paid': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Cash Collected from Customer': 'bg-orange-100 text-orange-800 border-orange-200',
    'Customer Deposited to Bank': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Paid (Pending Approval)': 'bg-blue-100 text-blue-800 border-blue-200',
    'Paid': 'bg-green-100 text-green-800 border-green-200'
  };
  
  return `${variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200'} border`;
};


const MobileApplicationCard = memo(({ 
  application, 
  onRowClick, 
  selectedApplicationId,
  selectedMonth
}: MobileApplicationCardProps) => {
  // Use the same data flow as desktop ApplicationRow - directly from application object
  const displayStatus = application.status || 'Unpaid';
  const displayPtpDate = application.ptp_date;
  
  // State for comments (similar to desktop ApplicationRow)
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Fetch comments for this application (same logic as desktop)
  useEffect(() => {
    const fetchComments = async () => {
      if (!application.payment_id) {
        console.log('⚠️ No payment_id for application:', application.applicant_id);
        return;
      }
      
      console.log('🔍 Fetching comments for mobile application:', application.applicant_id, 'payment_id:', application.payment_id);
      setCommentsLoading(true);
      try {
        const commentsResponse = await CommentsService.getCommentsByRepaymentAndType(
          application.payment_id.toString(),
          COMMENT_TYPES.APPLICATION_DETAILS,
          0, // skip
          3  // limit - get top 3 comments
        );
        
        if (commentsResponse.results && commentsResponse.results.length > 0) {
          console.log('✅ Found comments for mobile application:', application.applicant_id, 'count:', commentsResponse.results.length);
          setComments(commentsResponse.results.map(comment => ({
            ...comment,
            user_name: comment.user_name || `User ${comment.user_id}`, // Use actual username from backend
            content: comment.comment,
            application_id: application.applicant_id || ''
          })));
        } else {
          console.log('ℹ️ No comments found for mobile application:', application.applicant_id);
          setComments([]);
        }
      } catch (error) {
        console.error('❌ Error fetching comments for mobile application:', error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [application.payment_id, application.applicant_id]);

  // Debug logging for mobile number
  console.log('MobileApplicationCard Debug:', {
    applicant_name: application.applicant_name,
    applicant_mobile: application.applicant_mobile,
    hasMobile: !!application.applicant_mobile
  });

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] bg-white border border-gray-200 ${
        selectedApplicationId === application.id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-lg'
      }`}
      onClick={() => onRowClick(application)}
    >
      <CardContent className="p-4">
        {/* Header Section - Customer Name, ID, and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{application.applicant_name}</h3>
            <p className="text-sm text-gray-600">ID: {application.applicant_id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge className={`px-3 py-1 text-sm font-medium ${
                displayStatus === 'Unpaid' ? 'bg-red-100 text-red-800 border-red-200' :
                displayStatus === 'Paid' ? 'bg-green-100 text-green-800 border-green-200' :
                'bg-yellow-100 text-yellow-800 border-yellow-200'
              } border rounded-full`}>
                {displayStatus}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(application);
                }}
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            {/* Call Button below eye icon */}
            {application.applicant_mobile ? (
              <CallButton 
                name="Call" 
                phone={application.applicant_mobile}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('No mobile number available for:', application.applicant_name);
                }}
              >
                <Phone className="h-3 w-3 mr-1" />
                <span className="text-xs">No Number</span>
              </Button>
            )}
          </div>
        </div>

        {/* EMI Amount Section - Prominent blue box */}
        <div className="mb-4">
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">EMI Amount</p>
            <p className="text-xl font-bold text-blue-800">{formatCurrency(application.emi_amount)}</p>
          </div>
        </div>


        {/* Lender and RM Details */}
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Lender:</span>
                <span className="text-sm font-medium">{application.lender_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Dealer:</span>
                <span className="text-sm font-medium">{application.dealer_name}</span>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">RM:</span>
                <span className="text-sm font-medium">{application.rm_name}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Branch:</span>
                <span className="text-sm font-medium">{application.branch_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PTP Date Section - Yellow highlighted box */}
        <div className="mb-4">
          <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">PTP Date:</p>
            <p className="text-lg font-bold text-yellow-800">
              {displayPtpDate ? formatPtpDate(displayPtpDate) : 'Not Set'}
            </p>
          </div>
        </div>

        {/* Pre-EMI Status */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Pre-EMI:</p>
          <p className="text-sm font-medium text-blue-600">
            {getPreEmiStatusLabel(application.demand_calling_status)}
          </p>
        </div>

        {/* Amount Collected */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Amount Collected:</p>
          <p className="text-sm font-semibold text-green-600">
            {application.amount_collected ? formatCurrency(application.amount_collected) : 'Not Collected'}
          </p>
        </div>

        {/* Recent Comments Section */}
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Recent Comments:</p>
          {commentsLoading ? (
            <div className="text-xs text-gray-400 italic">Loading comments...</div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-2">
              {comments.slice(0, 2).map((comment: any, index: number) => (
                <div key={index} className="relative pl-4">
                  {/* Light blue vertical line */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                  {/* User name in blue */}
                  <div className="font-medium text-blue-600 text-sm mb-1">
                    {comment.user_name || 'Unknown User'}
                  </div>
                  {/* Comment text */}
                  <div className="text-xs text-gray-700 break-words">{comment.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No comments yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

MobileApplicationCard.displayName = "MobileApplicationCard";

export default MobileApplicationCard;
