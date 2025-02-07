import WebhooksService from '#common/services/webhooks_service'
import CommentLike from '#social/models/comment_like'
import Comment from '#social/models/comment'
import CommentPolicy from '#social/policies/comment_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class CommentsController {
  async store({ auth, request, params, response }: HttpContext) {
    const storeCommentValidator = vine.compile(
      vine.object({
        text: vine.string().trim().minLength(1).maxLength(255),
      })
    )

    const data = await request.validateUsing(storeCommentValidator)
    const postComment = new Comment()
    postComment.userId = auth.user!.id
    postComment.postId = params.postId
    postComment.text = data.text
    if (request.input('commentId')) postComment.commentId = request.input('commentId')
    await postComment.save()

    return response.redirect().back()
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    const comment = await Comment.findBy('id', params.commentId)
    if (comment === null) {
      return response.notFound('Comment not found.')
    }

    if (await bouncer.with(CommentPolicy).denies('delete', comment)) {
      return response.forbidden('Cannot delete this comment.')
    }

    await comment.delete()

    return response.redirect().back()
  }

  async like({ auth, params, response }: HttpContext) {
    const comment = await Comment.findBy('id', params.commentId)
    if (comment === null) {
      return response.notFound('Comment not found.')
    }

    await CommentLike.firstOrCreate({
      userId: auth.user!.id,
      commentId: comment.id,
    })

    return response.redirect().back()
  }

  async unlike({ auth, params, response }: HttpContext) {
    const comment = await Comment.findBy('id', params.commentId)
    if (comment === null) {
      return response.notFound('Comment not found.')
    }

    const commentLike = await CommentLike.query()
      .where('user_id', auth.user!.id)
      .andWhere('comment_id', comment.id)
      .first()
    if (commentLike === null) {
      return response.notFound('Like not found.')
    }

    await commentLike.delete()

    return response.redirect().back()
  }

  @inject()
  async report({ auth, params, request, response }: HttpContext, webhooksService: WebhooksService) {
    const comment = await Comment.findBy('id', params.commentId)
    if (comment === null) {
      return response.notFound('Comment not found.')
    }

    await webhooksService.send(
      `[!] [Post Report] [User ${auth.user!.id}] [Comment ${params.commentId}] [Description ${request.input('description')}]`
    )

    return response.ok('Comment reported!')
  }
}
