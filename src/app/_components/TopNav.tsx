"use client"
import React, { ReactNode } from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NextBreadcrumb = () => {
  const paths = usePathname()
  const pathNames = paths.split('/').filter(path => path)
  const containerClasses = 'flex py-5';
  const listClasses = 'hover:underline mx-2 font-bold';
  const activeClasses = 'flex py-5';

  return (
    <div>
      <ul className={containerClasses}>
        <li className={listClasses}><Link href={'/'}>User List</Link></li>
      </ul>
    </div>
  )
}

export default NextBreadcrumb