import { useState } from 'react';
import { Card, CardBody, CardHeader, Container, Form, Label, Input } from 'reactstrap';
import Button from '../components/Button';

import { signup } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const response = await signup({ name, email, password });
        setLoading(false);

        if (response.status !== 201) return setError(response.data.message);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        navigate('/home');
    };

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else if (e.target.name === 'name') {
            setName(e.target.value);
        }
    };

    return (
        <Container className='h-100'>
            <div style={{ display: 'grid', placeItems: 'center' }} className='h-100'>
                <Card style={{ width: 400 }}>
                    <CardHeader className='text-center'>Signup</CardHeader>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <Label>Name</Label>
                            <Input name='name' value={name} onChange={handleChange} required />
                            <Label>Email</Label>
                            <Input type='email' name='email' value={email} onChange={handleChange} required />
                            <Label>Password</Label>
                            <Input type='password' name='password' onChange={handleChange} required />

                            {error && <p className='text-danger'>{error}</p>}
                            <Button type='submit' className='mt-3' color='primary' block loading={loading}>
                                Signup
                            </Button>

                            <div className='mt-2'>
                                <p>
                                    Already have an account? <Link to='/signin'>Signin</Link>
                                </p>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </Container>
    );
};

export default Signup;
