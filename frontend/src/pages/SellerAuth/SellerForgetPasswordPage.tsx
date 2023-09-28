import { useState } from 'react';
import isEmailValidator from 'validator/lib/isEmail';
import Button from '../../components/Button';
import { axiosInstance } from '../../server';
import { toast } from 'react-toastify';

const ShopForgetPasswordPage = () => {
    const [validate, setValidate] = useState<boolean>(true);
    const [email, setEmail] = useState("");

    const forgetPassword = async () => {
        if (validate && email.length) {
            try {
                const res = await axiosInstance.post("/shop/forget-password", email);
                toast.success(res.data.message)
            } catch (error: any) {
                console.log(error.response.data.message);
                toast.error(error.response.data.message)
            }
        } else {
            setValidate(false);
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center px-2 py-12 sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Forget Shop Password</h2>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <label
                            htmlFor="forgetPassword"
                            className="block text-sm font-medium text-gray-700"
                        >Enter your shop email</label>

                        <input
                            name="forgetPassword"
                            value={email}
                            onChange={(e) => {
                                setValidate(isEmailValidator(email));
                                setEmail(e.target.value);
                            }}
                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {validate ? null : <p className='text-[#ef4444]'>Invaild Email.</p>}

                        <Button title="Send" onClick={() => forgetPassword()} style={{ marginTop: 25 }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopForgetPasswordPage