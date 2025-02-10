import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import path from 'node:path'
import fs from 'fs/promises'

export default class MemesDownload extends BaseCommand {
  static commandName = 'memes:download'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    try {
      // Ensure output directory exists
      const outputDir = path.join(process.cwd(), 'public/memes')
      await fs.mkdir(outputDir, { recursive: true })

      // Fetch memes from Imgflip API
      this.logger.info('Fetching memes from Imgflip API...')
      const response = await fetch('https://api.imgflip.com/get_memes')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiData = (await response.json()) as {
        data: { memes: { id: string; name: string; url: string }[] }
      }

      // Prepare memes to download
      let memes = apiData.data.memes

      // Download memes
      const downloadedMemes: any[] = []
      for (const meme of memes) {
        try {
          // Download image
          const imgResponse = await fetch(meme.url)

          if (!imgResponse.ok) {
            throw new Error(`Failed to download image: ${imgResponse.status}`)
          }

          const imgBlob = await imgResponse.arrayBuffer()

          // Create sanitized filename
          const filename = meme.url.replaceAll('https://i.imgflip.com', '')
          const filePath = path.join(outputDir, filename)

          // Save image
          await fs.writeFile(filePath, Buffer.from(imgBlob))

          // Track downloaded meme
          downloadedMemes.push({
            name: meme.name,
            url: `/memes` + filename,
            filename: filename,
          })

          this.logger.success(`Downloaded: ${filename}`)
        } catch (error) {
          this.logger.error(
            `Error downloading ${meme.name}: ${error instanceof Error ? error.message : error}`
          )
        }
      }

      // Save downloaded memes metadata
      const downloadedMemesPath = path.join(outputDir, 'metadata.json')
      await fs.writeFile(downloadedMemesPath, JSON.stringify(downloadedMemes, null, 2))

      this.logger.success(`Downloaded ${downloadedMemes.length} out of ${memes.length} memes`)
    } catch (error) {
      this.logger.error(
        `Failed to download memes: ${error instanceof Error ? error.message : error}`
      )
    }
  }
}
