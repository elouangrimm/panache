import usePageProps from '#common/ui/hooks/use_page_props'
import Profile from '#social/models/profile'

export function useProfiles(): Profile[] {
  const { profiles } = usePageProps<{ profiles: Profile[] }>()
  return profiles
}
