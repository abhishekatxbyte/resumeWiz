import React from 'react';
import { Form, Input, ConfigProvider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import moment from 'moment/moment';
import style from './../style.module.css'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../store/userslice';


const SignInForm = () => {
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

                <div className='flex items-center gap-3 justify-end'>


                    <Form.Item>
                        <button
                            size='large'
                            type="primary" htmlType="submit" className="pt-2 pb-2 pl-3 pr-3 text-white rounded-md font-bold		  bg-[#4292dc]">
                            Sign In
                        </button>
                    </Form.Item>
                    <p className='text-blue-600 font-bold text-[14px] cursor-pointer' onClick={() => { navigate('/signup', { replace: true }) }}> Not Registered ?</p>
                </div>
            </Form>
        </ConfigProvider >
    );
};

export default SignInForm;
