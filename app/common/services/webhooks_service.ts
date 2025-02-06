import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export default class WebhooksService {
  async send(content: string) {
    const webhookUrl = env.get('WEBHOOK_URL')
    if (!webhookUrl) {
      return
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
    } catch (error) {
      logger.error({ error }, 'Something went wrong while sending webhook')
    }
  }
}
