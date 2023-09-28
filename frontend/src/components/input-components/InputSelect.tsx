import { Controller } from 'react-hook-form';

const InputSelect = ({ control, name, error, placeholder, label, list = [], ...props }: any) => {
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
            <select
              className="w-full mt-2 border h-[35px] rounded-[5px]"
              onChange={(e: any) => {
                e.target.value && onChange(JSON.parse(e.target.value));
              }}
              {...props}>
              <option value="null">{placeholder}</option>
              {list &&
                list.map((listItem: any) => (
                  <option
                    value={JSON.stringify({
                      index: listItem.id,
                      value: listItem.title
                    })}
                    key={listItem.title}>
                    {listItem.title}
                  </option>
                ))}
            </select>
          </div>
          {message && <p className="text-[#ef4444]">{message}</p>}
        </div>
      )}
    />
  );
};

export default InputSelect;
