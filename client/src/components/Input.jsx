import { useState } from 'react'
import { Form, Button, FormGroup, TextInput} from 'carbon-components-react'

const Input = ({ onSearch }) => {
    const [text, setText] = useState("");
    const [invalid, setInvalid] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault(); // Prevents page refresh

        if (!text) {    // Search is empty
            setInvalid(true);
            return;
        }
        setInvalid(false);
        onSearch({ text });

        setText("");    // Resets input text
    };

    return (
        <Form onSubmit={onSubmit}>
            <FormGroup legendText="">
                <TextInput 
                    className="search-input"
                    id="search-input-0"
                    labelText=""
                    value={text}
                    maxLength={19}
                    invalidText={"Please put some keywoards"}
                    invalid={invalid}
                    onChange={(e) => setText(e.target.value)}
                />

            </FormGroup>

            <Button type="submit">
                Let's go
            </Button>
        </Form>
    )
}

export default Input
