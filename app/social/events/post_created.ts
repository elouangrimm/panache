import Post from '#social/models/post'
import { BaseEvent } from '@adonisjs/core/events'

export default class PostCreated extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public post: Post) {
    super()
  }
}
