import WebhooksService from '#common/services/webhooks_service'
import PostComment from '#social/models/post_comment'
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
    const postComment = new PostComment()
    postComment.userId = auth.user!.id
    postComment.postId = params.postId
    postComment.text = data.text
    if (request.input('commentId')) postComment.commentId = request.input('commentId')
    await postComment.save()

    return response.redirect().back()
  }

  @inject()
  async report({ auth, params, request, response }: HttpContext, webhooksService: WebhooksService) {
    const comment = await PostComment.findBy('id', params.commentId)
    if (comment === null) {
      return response.notFound('Comment not found.')
    }

    await webhooksService.send(
      `[!] [Post Report] [User ${auth.user!.id}] [Comment ${params.commentId}] [Description ${request.input('description')}]`
    )

    return response.ok('Comment reported!')
  }
}
