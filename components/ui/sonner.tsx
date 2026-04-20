import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-sm group-[.toaster]:font-sans",
          description: "group-[.toast]:text-gray-500",
          actionButton: "group-[.toast]:bg-maroon group-[.toast]:text-white group-[.toast]:rounded-sm group-[.toast]:px-4 group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:text-[0.6rem] group-[.toast]:tracking-widest",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 group-[.toast]:rounded-sm group-[.toast]:px-4 group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:text-[0.6rem] group-[.toast]:tracking-widest",
          success: "group-[.toaster]:border-green-500 group-[.toaster]:bg-green-50/50",
          error: "group-[.toaster]:border-maroon group-[.toaster]:bg-red-50/50",
          info: "group-[.toaster]:border-gray-900",
          warning: "group-[.toaster]:border-gold",
        },
      }}
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-green-600" />
        ),
        info: (
          <InfoIcon className="size-4 text-gray-900" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-gold" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-maroon" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-maroon" />
        ),
      }}
      {...props}
    />
  )
}

export { Toaster }
