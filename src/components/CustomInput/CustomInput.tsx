import DatePicker from './DatePicker/DatePicker';
import { ComboBox } from './ComboBox/ComboBox';

type InputType = 'Default' | 'DatePicker' | 'ComboBox';



export default function CustomInput ({ label, inputID, type } : {label: string, inputID: string, type: InputType}){
    return (
        <div className="w-70 h-fit flex flex-col ">
            <label className="body-s " htmlFor={inputID}>
                {label}
            </label>
            {type === 'Default' 
                ? <input id={inputID} type='text' className="rounded-s min-h-13.25 bg-white body-xs focus:outline-none px-4.25 py-4.75"/>
                : type === 'DatePicker'
                    ? <DatePicker/>
                    : <ComboBox />
            }
        </div>

    )
}

