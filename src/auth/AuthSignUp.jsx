import React from 'react'
import SignupForm from './Forms/SignupForm'
import style from './style.module.css'
import authImage from './../assets/signup.png'
import componeyLogo from './../assets/favicon.png'
const AuthSignUp = () => {
    return (
        <div className={style.container}>
            <div className='grid grid-cols-1 sm:grid-cols-2 items-center justify-center p-[20px] rounded-md	'>
                <div className='grid justify-items-center	'>
                    <img className='w-[80%] hidden sm:block' alt="auth" src={authImage} />
                </div>
                <div className='grid grid-cols-1 justify-center bg-[#f1f8ff] p-[20px]	 rounded-md'>    <div className='flex items-center justify-center gap-[1em] p-[20px]'>
                    Powered by
                    <img src={componeyLogo} className='w-[50px]' alt="componey logo" />
                </div> <SignupForm /></div>
            </div>
            <div className={style.footer_container}>
                Powered by
                <img src={componeyLogo} alt="componey logo" />
            </div>
        </div >
    )
}

export default AuthSignUp