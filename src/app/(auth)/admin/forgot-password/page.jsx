'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';
import ErrorMessage from '@/components/auth/ErrorMessage';
import { validateEmail } from '@/lib/validation';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call - Replace this with your actual password reset logic
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Redirect to verification code page with email
            toast.success('Verification code sent to your email!');
            setIsLoading(false);
            router.push(`/admin/verify-code?email=${encodeURIComponent(email)}`);

        } catch (err) {
            setError('Failed to send verification code. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forget Password?"
            description="Please enter your email to get verification code"
        >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <ErrorMessage message={error} />

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Email address
                    </label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isLoading}
                        className="border-primary focus-visible:border-primary focus-visible:ring-primary/50"
                    />
                </div>

                {/* Continue Button */}
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Continue'}
                </Button>
            </form>
        </AuthLayout>
    );
}