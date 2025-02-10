import { configApp } from '@adonisjs/eslint-config'
export default configApp({
  // disable no shadow rule
  rules: {
    '@typescript-eslint/no-shadow': 'off',
  },
})
