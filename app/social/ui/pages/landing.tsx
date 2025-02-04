import React from 'react'
import SocialLayout from '../components/social_layout'
import { SortBySelect } from '../components/sort_by_select'

export default function Landing() {
  return (
    <SocialLayout>
      <div className="p-4 max-w-5xl mx-auto w-full">
        <SortBySelect />
      </div>
    </SocialLayout>
  )
}
