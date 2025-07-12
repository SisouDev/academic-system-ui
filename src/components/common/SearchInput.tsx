import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'lucide-react';

export const SearchInput = () => {
    return (
        <InputGroup>
            <InputGroup.Text style={{ backgroundColor: '#fff', borderRight: 'none' }}>
                <Search size={18} color="#6c757d" />
            </InputGroup.Text>
            <Form.Control
                placeholder="Buscar..."
                style={{ borderLeft: 'none' }}
            />
        </InputGroup>
    )
}