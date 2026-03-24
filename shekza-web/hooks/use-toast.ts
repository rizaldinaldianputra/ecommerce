import { toast as sonnerToast } from "sonner"
import * as React from "react"

export type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      const descriptionStr = typeof description === 'string' ? description : undefined;
      const titleStr = typeof title === 'string' ? title : 'Notification';

      if (variant === "destructive") {
        sonnerToast.error(titleStr, { description: descriptionStr })
      } else if (variant === "success") {
        sonnerToast.success(titleStr, { description: descriptionStr })
      } else {
        sonnerToast(titleStr, { description: descriptionStr })
      }
    },
    dismiss: (id?: string) => {},
  }
}

export const toast = ({ title, description, variant }: ToastProps) => {
  const descriptionStr = typeof description === 'string' ? description : undefined;
  const titleStr = typeof title === 'string' ? title : 'Notification';

  if (variant === "destructive") {
    sonnerToast.error(titleStr, { description: descriptionStr })
  } else if (variant === "success") {
    sonnerToast.success(titleStr, { description: descriptionStr })
  } else {
    sonnerToast(titleStr, { description: descriptionStr })
  }
}
