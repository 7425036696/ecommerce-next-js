'use client'
import { SignUp, useClerk } from '@clerk/nextjs';

export default function Page() {

  return (
    <div className="flex w-full justify-center items-center">
      <SignUp routing="hash" />
    </div>
  );
}
