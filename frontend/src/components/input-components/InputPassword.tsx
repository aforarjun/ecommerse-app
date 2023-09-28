import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function InputPassword({ control, name, error, placeholder, label, ...props }: any) {
  const { message } = error || {};
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="w-full">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
          </label>

          <div className="mt-1 relative">
            <input
              type={visible ? 'text' : 'password'}
              name={name}
              value={value}
              onChange={(e) => onChange(e)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...props}
            />
            {visible ? (
              <AiOutlineEye
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={() => setVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={() => setVisible(true)}
              />
            )}
          </div>
          {message && <p className="text-[#ef4444]">{message}</p>}
        </div>
      )}
    />
  );
}

export default InputPassword;
