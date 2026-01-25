import DatePicker from "./DatePicker";
import { ComboBox } from "./ComboBox";

type InputType = 'DatePicker' | 'ComboBox' | 'email' | 'password' | 'text';



export default function CustomInput ({ label, inputID, type } : {label: string, inputID: string, type: InputType}){
    return (
        <div className="w-70 h-fit flex flex-col gap-1.75">
            <label className="body-s " htmlFor={inputID}>
                {label}
            </label>
            {(type === 'text' || 'email' || 'password')
                ? <input id={inputID} name={inputID} type={type} className="rounded-s min-h-13.25 bg-white body-xs focus:outline-none px-4.25 py-4.75"/>
                : type === 'DatePicker'
                    ? <DatePicker/>
                    : <ComboBox />
            }
        </div>

    )
}

