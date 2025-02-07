import { Button } from '#common/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#common/ui/components/dropdown-menu'
import useTranslate from '#common/ui/hooks/use_translate'
import { DeleteIcon, FlagIcon, MoreHorizontal, PlusCircleIcon } from 'lucide-react'
import React from 'react'
import useUser from '#common/ui/hooks/use_user'
import Comment from '#social/models/comment'
import { ReportCommentDialog } from './report_comment_dialog'
import { DeleteCommentDialog } from './delete_comment_dialog'

export function CommentActionsDropdown({ comment }: { comment: Comment }) {
  const t = useTranslate()
  const [showReportDialog, setShowReportDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const user = useUser()

  if (!user) {
    return null
  }

  return (
    <>
      <ReportCommentDialog
        comment={comment}
        open={showReportDialog}
        setOpen={setShowReportDialog}
      />
      <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          <DropdownMenuGroup className="space-y-1">
            <DropdownMenuItem
              className="cursor-pointer text-yellow-700"
              onClick={() => setShowReportDialog(true)}
            >
              <FlagIcon className="!h-5 !w-5 ml-0.5" />
              <span>{t('social.report')}</span>
            </DropdownMenuItem>

            {(user?.role === 'admin' || user?.currentProfileId === comment.profileId) && (
              <DropdownMenuItem
                className="cursor-pointer text-red-700"
                onClick={() => setShowDeleteDialog(true)}
              >
                <DeleteIcon className="!h-5 !w-5 ml-0.5" />
                <span>{t('common.delete')}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
