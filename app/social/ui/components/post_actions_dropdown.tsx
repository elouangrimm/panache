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
import { DeletePostDialog } from './delete_post_dialog'
import Post from '#social/models/post'
import useUser from '#common/ui/hooks/use_user'
import { ReportPostDialog } from './report_post_dialog'

export function PostActionsDropdown({ post }: { post: Post }) {
  const t = useTranslate('social')
  const [showReportDialog, setShowReportDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const user = useUser()

  if (!user) {
    return null
  }

  return (
    <>
      <ReportPostDialog post={post} open={showReportDialog} setOpen={setShowReportDialog} />
      <DeletePostDialog post={post} open={showDeleteDialog} setOpen={setShowDeleteDialog} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer text-yellow-700"
              onClick={() => setShowReportDialog(true)}
            >
              <FlagIcon className="!h-5 !w-5 ml-0.5" />
              <span>{t('report')}</span>
            </DropdownMenuItem>
            {(user?.role === 'admin' || user?.id === post.userId) && (
              <DropdownMenuItem
                className="cursor-pointer text-red-700"
                onClick={() => setShowDeleteDialog(true)}
              >
                <DeleteIcon className="!h-5 !w-5 ml-0.5" />
                <span>{t('delete_post')}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
