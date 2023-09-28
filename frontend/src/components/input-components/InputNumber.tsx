import { Controller } from 'react-hook-form';

function InputPhoneNumber({ control, name, error, placeholder, label, ...props }: any) {
  const { message } = error || {};

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="w-full">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
          </label>

          <div className="mt-1">
            <input
              type="number"
              name={name}
              value={value ? value : ''}
              onChange={(e) => onChange(e)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...props}
            />
          </div>
          {message && <p className="text-[#ef4444]">{message}</p>}
        </div>
      )}
    />
  );
}

export default InputPhoneNumber;
