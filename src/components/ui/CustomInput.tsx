import DatePicker from "./DatePicker";
import ComboboxAssignee from "./ComboboxAssignee"
import ComboboxPriority from "./ComboboxPriority";

type InputType = 'DatePicker' | 'Assignee' | 'email' | 'password' | 'text' | 'Priority';

export default function CustomInput({ 
  label, 
  inputID, 
  type,
  required = false,
  onValueChange,
  error
}: {
  label: string, 
  inputID: string, 
  type: InputType,
  required?: boolean,
  onValueChange?: ()=>void,
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.75 w-full">
      <label className="body-s" htmlFor={(type === 'text' || type === 'email' || type === 'password') ? inputID : undefined}>
        {label}
      </label>
      {(type === 'text' || type === 'email' || type === 'password') ? (
        <input 
          id={inputID} 
          name={inputID} 
          type={type} 
          className={`rounded-lg min-h-13.25 bg-white body-xs focus:outline-none px-4.25 py-4.75 border ${error ? 'border-red-500' : ''}`}
          required={required}
        />
      ) : type === 'DatePicker' ? (
        <DatePicker 
          name={inputID} 
          required={required} 
          onValueChange={onValueChange}
        /> 
      ) : type === 'Assignee' ? (
        <ComboboxAssignee
          name={inputID} 
          required={required} 
          onValueChange={onValueChange}
        /> 
      ) : (
        <ComboboxPriority
          name={inputID} 
          required={required} 
          onValueChange={onValueChange}
        /> 
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}