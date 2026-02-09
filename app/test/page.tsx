'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
    const [policies, setPolicies] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            // Fetch all policies
            const { data, error } = await supabase.from('policies').select('*')
            if (data) setPolicies(data)
            if (error) console.error('Error:', error)
        }
        fetchData()
    }, [])

    return (
        <div className="p-10 min-h-screen bg-white text-black">
            <h1 className="text-2xl font-bold mb-4 text-black">ทดสอบเชื่อมต่อ Database</h1>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-black">
                {JSON.stringify(policies, null, 2)}
            </pre>
        </div>
    )
}
