'use client'
import * as z from 'zod';
import Link from 'next/link';
import { useDebounceValue } from 'usehooks-ts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const page = () => {

    const [username, setUsername] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [userNameMessage, setUserNameMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email,setEmail] = useState("");
    
    const debouncedUsername = useDebounceValue(username, 500);
    
    return (
        <div>
            sign in page
        </div>
    )
}

export default page
