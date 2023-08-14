import { Controller } from 'react-hook-form'

function Checkbox({
    control,
    name,
    error,
    label,
    ...props
}: any) {
    const { message } = error || {};

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <div>
                    <div className='flex items-center'>
                        <input
                            type="checkbox"
                            name="remember-me"
                            id="remember-me"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            value={value}
                            onChange={(e) => onChange(e)}
                            checked={value}
                            {...props}
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-900"
                        >{label}</label>
                    </div>
                    {message && <p className='text-[#ef4444]'>{message}</p>}
                </div>
            )}
        />

    )
}

export default Checkbox