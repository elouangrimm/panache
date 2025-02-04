import User from '#common/models/user'
import usePageProps from './use_page_props.js'

export default function useUser() {
  const props = usePageProps<{
    user: User
  }>()

  return props.user
}
