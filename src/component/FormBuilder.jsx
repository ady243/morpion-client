import Button from './Button';
import { Input } from "@nextui-org/react";

const Field = ({ field }) => {
    switch (field.type) {
        case 'text':
        case 'password':
        case 'email':
        case 'number':
        case 'date':
        case 'textarea':
            case 'label':
        case 'file':
            return (
                <div>
                    {field.label && <p style={{ marginRight:'90%', fontSize:'12px' }}>{field.label}</p>}
                    <Input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={field.value}
                        onChange={field.onChange}
                    />
                </div>

            );
        case 'button':
            return <Button text={field.label} onClick={field.onClick} className="bg-blue-500 hover:bg-blue-700 text-white
            font-bold py-2 px-4 rounded" style={{
                display: 'inline-block',
                width: '450px',
                padding: '10px 20px',
                margin: '15px 0',
                cursor: 'pointer'
            }} />;
        default:
            return null;
    }
};

const FormBuilder = ({ fields }) => (
    <form className="space-y-4">
        {fields.map((field, index) => <Field key={index} field={field} />)}
    </form>
);

export default FormBuilder;