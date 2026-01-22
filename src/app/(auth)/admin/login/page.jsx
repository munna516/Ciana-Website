'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';
import ErrorMessage from '@/components/auth/ErrorMessage';
import PasswordInput from '@/components/auth/PasswordInput';
import { validateEmail, validatePassword } from '@/lib/validation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [rememberPassword, setRememberPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call - Replace this with your actual authentication logic
            // For now, we'll just check if fields are filled and redirect
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Store authentication state (you can use localStorage, cookies, or context)
            if (rememberPassword) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Redirect to dashboard on successful login
            router.push('/admin/dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Login to Account"
            description="Please enter your email and password to continue"
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
                    />
                </div>

                {/* Password Field */}
                <PasswordInput
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                />

                        {/* Remember Password & Forget Password */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={rememberPassword}
                                        onChange={(e) => setRememberPassword(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm border-2 transition-all duration-200 flex items-center justify-center ${rememberPassword
                                        ? 'border-primary bg-primary'
                                        : 'border-gray-300 bg-transparent'
                                        }`}>
                                        {rememberPassword && (
                                            <svg
                                                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="ml-2 text-sm sm:text-base text-gray-700">
                                    Remember Password
                                </span>
                            </label>
                            <Link
                                href="/admin/forgot-password"
                                className="text-sm sm:text-base hover:underline hover:text-primary font-medium transition-colors"
                            >
                                Forget Password?
                            </Link>
                        </div>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
        </AuthLayout>
    );
}