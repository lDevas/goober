"use client"

import React from 'react'
import Link from 'next/link'

const NextBreadcrumb = () => {
  return (
    <div>
      <ul className={'flex py-5'}>
        <li className={'hover:underline mx-2 font-bold'}><Link href={'/'}>Goober</Link></li>
      </ul>
    </div>
  )
}

export default NextBreadcrumb