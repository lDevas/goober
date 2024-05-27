'use client'

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { api } from "~/trpc/react";

interface SubmitButtonProps {
  className: string;
  text: string;
}

const SubmitButton = ({ className, text }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? 'Loading...' : text}
    </button>
  );
}

interface AvailablilityProps {
  driver: any
}

export default function Availablility({ driver }: AvailablilityProps) {
  const router = useRouter()
  const toggleAvailable = api.driver.toggleAvailable.useMutation();
  const handleSubmit = async () => {
    await toggleAvailable.mutateAsync({ driverId: driver.id });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col items-center justify-center">
      {driver.available ? (
        <>
          <span className="text-green-500">You are connected! a trip will be assigned to you soon</span>
          <SubmitButton className="mt-1 text-amber-600 py-2 px-3 border border-white rounded w-48" text='Disconnect' />
        </>
      ) : (
        <>
          <span className="text-amber-600">You are not connected and will not receive trip requests</span>
          <SubmitButton className="mt-1 text-green-500 py-2 px-3 border border-white rounded w-48" text='Connect' />
        </>
      )}
    </form>
  );
}

