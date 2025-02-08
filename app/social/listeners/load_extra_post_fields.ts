import Post from '#social/models/post'
import logger from '@adonisjs/core/services/logger'
import * as cheerio from 'cheerio'

export default class LoadExtraPostFields {
  async handle({ post }: { post: Post }) {
    if (!post.link) {
      return
    }

    try {
      // Fetch HTML content
      const response = await fetch(post.link)
      const html = await response.text()

      // Load HTML into Cheerio
      const $ = cheerio.load(html)

      // Find the title tag
      const linkTitle = $('title').text()
      if (linkTitle) {
        post.linkTitle = linkTitle
      }

      // Find the og:image meta tag
      const ogImage =
        $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content')

      if (ogImage) {
        post.ogImage = ogImage
      }

      await post.save()
    } catch (error) {
      logger.error({ error }, 'Failed to load extra post fields')
      return null
    }

    /**
     * TODO: Cache OG image into the an object storage
     */
  }
}
