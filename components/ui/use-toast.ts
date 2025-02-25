type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastState = ToastProps & {
  id: string
  open: boolean
}

type UseToastReturn = {
  toast: (props: ToastProps) => void
}

export function useToast(): UseToastReturn {
  return {
    toast: (props: ToastProps) => {
      alert(`${props.title}: ${props.description || ""}`)
    },
  }
}

