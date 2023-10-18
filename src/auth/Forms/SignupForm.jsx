import React from 'react';
import { Form, Input, DatePicker, ConfigProvider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import moment from 'moment/moment';
import style from './../style.module.css'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../store/userslice';


const SignupForm = () => {
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        const date = values.date_of_birth['$d']
        const newDate = moment(date).format('YYYY-MM-DD');
        values.date_of_birth = newDate
        values["is_admin"] = false
        dispatch(signUp(values))
    };
    const navigate = useNavigate()
    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#4292dc',
                    borderRadius: 2,
                },
            }}
        >
            <Form
                name="signup_form"
                className="flex flex-col gap-2"
                onFinish={onFinish}
            >


                <Form.Item
                    name="firstname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your First Name!',
                        },
                    ]}
                >
                    <Input className={style.inputField} size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First Name" />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Last Name!',
                        },
                    ]}
                >
                    <Input className={style.inputField} size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last Name" />
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Last Name!',
                        },
                    ]}
                >
                    <Input className={style.inputField} size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User Name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input className={style.inputField} size='large' prefix={<MailOutlined className="site-form-item-icon" />} placeholder="User Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        size='large'
                    />
                </Form.Item>



                <Form.Item

                    name="phone_number"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Phone Number!',
                        },
                    ]}
                >
                    <Input className={style.inputField} size='large' prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                    name="date_of_birth"
                    rules={[
                        {
                            required: true,
                            message: 'Please select your Date of Birth!',
                        },
                    ]}
                >
                    <DatePicker
                        size='large'
                        placeholder="Date of Birth"
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                    />
                </Form.Item>

                <div className='flex items-center gap-3 justify-end'>


                    <Form.Item>
                        <button

                            size='large'
                            type="primary" htmlType="submit" className="pt-2 pb-2 pl-3 pr-3 text-white rounded-md font-bold		  bg-[#4292dc]">
                            Sign Up
                        </button>
                    </Form.Item>
                    <p className='text-blue-600 font-bold text-[14px] cursor-pointer' onClick={() => { navigate('/signin', { replace: true }) }}>already Registered ?</p>
                </div>
            </Form>
        </ConfigProvider >
    );
};

export default SignupForm;
