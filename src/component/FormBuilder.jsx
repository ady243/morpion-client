import Button from './Button'; 

const Field = ({ field }) => {
    switch (field.type) {
        case 'text':
        case 'password':
        case 'email':
        case 'number':
        case 'date':
        case 'textarea':
        case 'file':
            return (
                <input 
                    type={field.type} 
                    name={field.name}
                    placeholder={field.placeholder} 
                    required={field.required}
                    value={field.value}
                    onChange={field.onChange}
                    className="border p-2 rounded"
                />
            );
        case 'button':
            return <Button text={field.label} onClick={field.onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />;
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