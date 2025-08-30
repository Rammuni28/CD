import { memo, useEffect, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Application } from "@/types/application";
import { formatEmiMonth, formatCurrency, formatPtpDate } from "@/utils/formatters";
import StatusBadge from "./StatusBadge";
import ApplicationDetails from "./ApplicationDetails";
import CallStatusDisplay from "../CallStatusDisplay";
import CommentsDisplay from "./CommentsDisplay";
import CallingStatusColumn from "./CallingStatusColumn";
import type { BatchComment } from "@/hooks/useBatchComments";
import type { BatchContactStatus } from "@/hooks/useBatchContactCallingStatus";
import { CommentsService } from "@/integrations/api/services/commentsService";
import { COMMENT_TYPES } from "@/integrations/api/services/commentsService";

interface ApplicationRowProps {
  application: Application;
  selectedApplicationId?: string;
  onRowClick: (application: Application) => void;
  selectedEmiMonth?: string | null;
  // Batched data props
  batchedStatus?: string;
  batchedPtpDate?: string | null;
  batchedContactStatus?: BatchContactStatus;
  batchedComments?: BatchComment[];
  isLoading?: boolean;
}

const ApplicationRow = memo(({ 
  application, 
  selectedApplicationId, 
  onRowClick,
  selectedEmiMonth,
  batchedStatus,
  batchedPtpDate,
  batchedContactStatus,
  batchedComments,
  isLoading
}: ApplicationRowProps) => {
  const [comments, setComments] = useState<BatchComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Fetch comments for this application
  useEffect(() => {
    const fetchComments = async () => {
      if (!application.payment_id) {
        console.log('⚠️ No payment_id for application:', application.applicant_id);
        return;
      }
      
      console.log('🔍 Fetching comments for application:', application.applicant_id, 'payment_id:', application.payment_id);
      setCommentsLoading(true);
      try {
        const commentsResponse = await CommentsService.getCommentsByRepaymentAndType(
          application.payment_id.toString(),
          COMMENT_TYPES.APPLICATION_DETAILS,
          0, // skip
          3  // limit - get top 3 comments
        );

        console.log('📝 Comments response for', application.applicant_id, ':', commentsResponse);

        if (commentsResponse.results && commentsResponse.results.length > 0) {
          const mappedComments: BatchComment[] = commentsResponse.results.map(comment => ({
            id: comment.id.toString(),
            content: comment.comment,
            created_at: comment.commented_at,
            user_id: comment.user_id.toString(),
            user_name: comment.user_name || `User ${comment.user_id}`,
            application_id: application.applicant_id
          }));
          console.log('✅ Mapped comments for', application.applicant_id, ':', mappedComments);
          setComments(mappedComments);
        } else {
          console.log('ℹ️ No comments found for application:', application.applicant_id);
          setComments([]);
        }
      } catch (error) {
        console.error('❌ Error fetching comments for application:', application.applicant_id, error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [application.payment_id, application.applicant_id]);

  const handleRowClick = (e: React.MouseEvent) => {
    onRowClick(application);
  };

  return (
    <TableRow
      className={`cursor-pointer transition-colors align-top ${
        selectedApplicationId === application.id
          ? 'bg-blue-50 border-l-4 border-l-blue-500 hover:bg-blue-100'
          : 'hover:bg-gray-50'
      }`}
      onClick={handleRowClick}
    >
      {/* Application Details */}
      <TableCell className="py-4 align-top w-[24%]">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-blue-800">{application.applicant_name}</span>
          <span className="text-xs text-gray-700">ID: {application.applicant_id}</span>
          <span className="text-xs text-gray-700">EMI Month: {formatEmiMonth(selectedEmiMonth ? selectedEmiMonth : application.emi_month)}</span>
          <span className="text-xs text-gray-700">Branch: {application.branch_name}</span>
          <span className="text-xs text-gray-700">TL: {application.team_lead}</span>
          <span className="text-xs text-gray-700">RM: {application.rm_name}</span>
          <span className="text-xs text-gray-700">Dealer: {application.dealer_name}</span>
          <span className="text-xs text-gray-700">Lender: {application.lender_name}</span>
        </div>
      </TableCell>

      {/* EMI Amount */}
      <TableCell className="py-4 align-top text-blue-600 font-semibold text-base w-[10%]">
        {formatCurrency(application.emi_amount)}
      </TableCell>

      {/* Status */}
      <TableCell className="py-4 align-top w-[10%]">
        <StatusBadge status={application.status} />
      </TableCell>

      {/* PTP Date */}
      <TableCell className="py-4 align-top w-[10%]">
        {batchedPtpDate ? formatPtpDate(batchedPtpDate) : (application.ptp_date ? formatPtpDate(application.ptp_date) : 'Not Set')}
      </TableCell>

      {/* Calling Status */}
      <TableCell className="py-4 align-top w-[10%]">
        <CallingStatusColumn
          callingStatuses={batchedContactStatus ? {
            applicant: batchedContactStatus.applicant || "Not Called",
            co_applicant: batchedContactStatus.co_applicant || "Not Called",
            guarantor: batchedContactStatus.guarantor || "Not Called",
            reference: batchedContactStatus.reference || "Not Called"
          } : {
            applicant: application.applicant_calling_status || "Not Called",
            co_applicant: application.co_applicant_calling_status || "Not Called",
            guarantor: application.guarantor_calling_status || "Not Called",
            reference: application.reference_calling_status || "Not Called"
          }}
        />
      </TableCell>

      {/* Recent Comments */}
      <TableCell className="py-4 align-top w-[20%]">
        <CommentsDisplay 
          comments={comments}
          hasComments={comments.length > 0}
          loading={commentsLoading}
        />
      </TableCell>
    </TableRow>
  );
});

ApplicationRow.displayName = "ApplicationRow";

export default ApplicationRow;
