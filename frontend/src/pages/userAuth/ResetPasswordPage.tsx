import * as yup from 'yup';
import { redirect, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import { InputPassword } from '../../components/input-components';
import { axiosInstance } from '../../server';

const ResetPassword = yup
    .object()
    .shape({
        password: yup.string().required('Password is required'),
        confirmPassword: yup
            .string()
            .required('Confirm password is required')
            .oneOf([yup.ref('password')], 'Password and confirm password does not match'),
        avatar: yup.string()
    })
    .required();

const ResetPasswordPage = () => {
    const { resetToken } = useParams();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(ResetPassword),
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {
            password: "", confirmPassword: ""
        }
    });

    const resetPassword = async (data: { password: string, confirmPassword: string }) => {
        try {
            if (resetToken) {
                const resetPassword = async () => {
                    try {
                        const res = await axiosInstance.post("/user/reset-password", data);
                        console.log(res.data.message);
                        redirect('/');
                    } catch (error: any) {
                        console.log(error.response.data.error);
                    }
                }

                resetPassword();
            }
        } catch (error) {

        }
    }


    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center px-2 py-12 sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Register a account</h2>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit(resetPassword)}>
                            <InputPassword
                                control={control}
                                name="password"
                                error={errors.password}
                                label="Password"
                                placeholder="Password"
                                required
                            />

                            <InputPassword
                                control={control}
                                name="confirmPassword"
                                error={errors.confirmPassword}
                                label="Confirm Password"
                                placeholder="Password"
                                required
                            />

                            <Button title="Reset Password" type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage