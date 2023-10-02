import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnableCustom, SET_CUSTOM_SCHEMA } from '../../store/slice';

function DynamicInput() {
    const [formFields, setFormFields] = useState([
        { category: '', keywords: '', description: '' },
    ])
    const custom_enable = useSelector(EnableCustom)
    const dispatch = useDispatch()
    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }


    const submit = (e) => {
        e.preventDefault();
        function generateCustomSchema() {
            const schema = {
                type: 'object',
                properties: {},
            };

            formFields.forEach((obj) => {
                const category = obj.category;

                if (category) {
                    const categoryProperties = obj.keywords.split(',').map((keyword) => keyword.trim());
                    const properties = {};

                    categoryProperties.forEach((prop) => {
                        properties[prop] = {
                            type: 'string',
                            description: obj.description,
                        };
                    });

                    schema.properties[category] = {
                        type: 'object',
                        properties,
                    };
                }
            });
            return schema;
        }
        const customSchema = generateCustomSchema();

        // Example usage:
        if (custom_enable) {
            dispatch(SET_CUSTOM_SCHEMA(customSchema))
        }
    }

    const addFields = () => {
        let object = { category: '', keywords: '', description: '' }

        setFormFields([...formFields, object])
    }

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
    }


    // Example input array




    return (
        <div className="App">
            <form onSubmit={submit}>
                {formFields.map((form, index) => {
                    return (
                        <div key={index}>
                            <input
                                name='category'
                                placeholder='category'
                                onChange={event => handleFormChange(event, index)}
                                value={form.category}
                            />
                            <input
                                name='keywords'
                                placeholder='keywords'
                                onChange={event => handleFormChange(event, index)}
                                value={form.keywords}
                            />
                            <input
                                name='description'
                                placeholder='description'
                                onChange={event => handleFormChange(event, index)}
                                value={form.description}
                            />
                            <button onClick={() => removeFields(index)}>Remove</button>
                        </div>
                    )
                })}
            </form>
            <button onClick={addFields}>Add More..</button>
            <br />
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default DynamicInput;