import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { RxAvatar } from "react-icons/rx";

function UploadImage({
    control,
    name,
    error,
    placeholder,
    label,
    ...props
}: any) {
    const { message } = error || {};
    const [avatar, setAvatar] = useState("");

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <div>
                    <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-gray-700"
                    ></label>
                    <div className="mt-2 flex items-center">
                        <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    className="h-full w-full object-cover rounded-full"
                                />
                            ) : (
                                <RxAvatar className="h-8 w-8" />
                            )}
                        </span>
                        <label
                            htmlFor="file-input"
                            className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <span>Upload a file</span>
                            <input
                                type="file"
                                name={name}
                                value={value?.name}
                                id="file-input"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    const reader: any = new FileReader();

                                    reader.readAsDataURL(file);

                                    reader.onload = (e: any) => {
                                        setAvatar(`${e.target?.result}`);
                                        onChange(e.target?.result)
                                    }
                                }}
                                className="sr-only"
                            />
                        </label>
                    </div>

                    {message && <p className='text-[#ef4444]'>{message}</p>}
                </div>
                // <div>
                //     <label
                //         htmlFor={name}
                //         className="block text-sm font-medium text-gray-700"
                //     >{label}</label>

                //     <div className="mt-1">
                //         <input
                //             type='file'
                //             name={name}
                //             value={value}
                //             onChange={(e) => onChange(e)}
                //             className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                //             {...props}
                //         />
                //     </div>
            )}
        />

    )
}

export default UploadImage