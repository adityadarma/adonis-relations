import type { ApplicationService } from '@adonisjs/core/types'
import { extendModelQueryBuilder } from '../src/bindings/model_query_builder.js'

export default class RelationsProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const { ModelQueryBuilder } = await this.app.import('@adonisjs/lucid/orm')
    extendModelQueryBuilder(ModelQueryBuilder)
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shut down the app
   */
  async shutdown() {}
}
