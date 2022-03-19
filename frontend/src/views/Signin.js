import { useState } from 'react';
import { Card, CardBody, CardHeader, Container, Form, Label, Input, Col } from 'reactstrap';
import Button from '../components/Button';

import { signin } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const response = await signin({ email, password });
        setLoading(false);

        if (response.status !== 200) return setError(response.data.message);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));

        navigate('/home');
    };

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    return (
        <Container className='h-100'>
            <div style={{ display: 'grid', placeItems: 'center' }} className='h-100 '>
                <Col xs='12' sm='8' lg='4'>
                    <Card>
                        <CardHeader className='text-center'>Signin</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <Label>Email</Label>
                                <Input type='email' name='email' value={email} onChange={handleChange} required />
                                <Label>Password</Label>
                                <Input type='password' name='password' onChange={handleChange} required />

                                {error && <p className='text-danger'>{error}</p>}
                                <Button type='submit' className='mt-3' color='primary' block loading={loading}>
                                    Signin
                                </Button>
                                <div className='mt-2'>
                                    <p>
                                        Don't have an account? <Link to='/signup'>Signup</Link>
                                    </p>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </div>
        </Container>
    );
};

export default Signin;
