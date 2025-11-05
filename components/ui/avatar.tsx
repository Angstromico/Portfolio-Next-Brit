'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarImageWithHoverProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  secondarySrc?: string
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'group relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageWithHoverProps
>(({ className, secondarySrc, ...props }, ref) => (
  <div className='relative h-full w-full'>
    {/* Primary image */}
    <AvatarPrimitive.Image
      ref={ref}
      className={cn(
        'aspect-square h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0',
        className
      )}
      {...props}
    />

    {/* Secondary image (hover image) */}
    {secondarySrc && (
      <img
        src={secondarySrc}
        alt=''
        className='absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100'
      />
    )}
  </div>
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
