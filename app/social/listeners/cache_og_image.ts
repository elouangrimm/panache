import Post from '#social/models/post'
import * as cheerio from 'cheerio'

export default class CacheOgImage {
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

      // Find the og:image meta tag
      const ogImage =
        $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content')

      if (!ogImage) {
        return
      }

      post.ogImage = ogImage
      await post.save()
    } catch (error) {
      console.error('Error retrieving og:image:', error)
      return null
    }

    /**
     * TODO: Cache OG image into the an object storage
     */
  }
}
