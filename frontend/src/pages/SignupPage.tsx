import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignupSchema } from '../utils/formSchema';
import { InputText, InputPassword, UploadImage } from '../components/input-components';
import styles from '../styles/styles';
import Button from '../components/Button';
import axios from 'axios';

function SignupPage() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(SignupSchema),
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {
            name: "", email: "", password: ""
        }
    });

    const Signup = (data: any) => {
        console.log(data);
        const { avatar, confirmPassword, ...otherUser } = data;

        axios.post('http://localhost:3001/api/v2/user/create-user', otherUser)
            .then((res) => {
                console.log(res.data)
            }).catch((err) => {
                console.log(err.message)
            })
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center px-2 py-12 sm:px-6 lg:px-8'>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Register a account</h2>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit(Signup)}>
                            <InputText
                                control={control}
                                name="name"
                                error={errors.name}
                                type="text"
                                label="Full name"
                                placeholder="First-last name"
                                required
                            />
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

                            <InputPassword
                                control={control}
                                name="confirmPassword"
                                error={errors.confirmPassword}
                                label="Confirm Password"
                                placeholder="Password"
                                required
                            />


                            <UploadImage
                                control={control}
                                name="avatar"
                                error={errors.avatar}
                            />

                            <Button title="Register" type="submit" />

                            <div className={`${styles.noramlFlex} w-full`}>
                                <h4>Already have an account ?</h4>
                                <Link to="/login" className="text-blue-600 pl-2">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage