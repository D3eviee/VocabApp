export const ErrorMessage = ({message}:{message:string}) => {
  return (
    <p className="text-[13px] font-medium text-error-primary mt-1 animate-in fade-in slide-in-from-bottom-1">{message}</p> 
  )
}