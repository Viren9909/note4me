import Navbar from '@/components/Navbar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            <div className='h-15 w-full'></div>
            {children}
        </div>
    )
}

export default layout
