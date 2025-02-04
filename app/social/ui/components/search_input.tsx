'use client'

import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import React from 'react'
import { Input } from '#common/ui/components/input'
import { Button } from '#common/ui/components/button'

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({ placeholder = 'Search...', className = '' }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
