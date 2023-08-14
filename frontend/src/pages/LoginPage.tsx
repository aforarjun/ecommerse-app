import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from '../utils/formSchema';
import { InputText, InputPassword, Checkbox } from '../components/input-components';
import styles from '../styles/styles';
import Button from '../components/Button';

function LoginPage() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(LoginSchema),
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {
            email: "", password: ""
        }
    });

    const Login = (data: any) => {
        console.log(data)
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center px-2 py-12 sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Login to your Account</h2>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit(Login)}>
                            <InputText
                                control={control}
                                name="email"
                                error={errors.email}
                                type="email"
                                label="Email Address"
                                placeholder="Email"
                                required
                                autoComplete="email"
                            />

                            <InputPassword
                                control={control}
                                name="password"
                                error={errors.password}
                                label="Password"
                                placeholder="Password"
                                required
                            />

                            <div className={`${styles.noramlFlex} justify-between`}>
                                <Checkbox
                                    control={control}
                                    name="rememberMe"
                                    error={errors.rememberMe}
                                    label="Remember me"
                                />
                                <div className="text-sm">
                                    <Link to="/forget-password" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <Button title="Sign In" type="submit" />

                            <div className={`${styles.noramlFlex} w-full`}>
                                <h4>Not have any account?</h4>
                                <Link to="/sign-up" className="text-blue-600 pl-2">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage