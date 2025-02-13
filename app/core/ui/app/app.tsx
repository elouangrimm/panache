/// <reference path="../../../../adonisrc.ts" />
/// <reference path="../../../../config/inertia.ts" />

import '../css/app.css'
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'Panache'

createInertiaApp({
  progress: { color: 'var(--color-emerald-700)' },

  title: (title) => (title ? title : appName),

  resolve: (name) => {
    const firstPart = name.split('/')[0]
    const rest = name.split('/').slice(1).join('/')
    return resolvePageComponent(
      `../../../${firstPart}/ui/pages/${rest}.tsx`,
      import.meta.glob('../../../*/ui/pages/**/*.tsx')
    )
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
