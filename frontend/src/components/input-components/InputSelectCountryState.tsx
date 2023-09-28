import { Controller } from 'react-hook-form';

function InputSelect({ control, name, error, placeholder, label, optionList = [], ...props }: any) {
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
              name={name}
              onChange={(e: any) => {
                if (props.setSelected) {
                  props.setSelected(e.target.value);
                }
                onChange(JSON.parse(e.target.value));
              }}
              className="w-full border h-[40px] rounded-[5px] px-3 py-2"
              {...props}>
              <option value="">Select ...</option>
              {optionList?.map((item: any) => (
                <option
                  key={item.isoCode}
                  value={JSON.stringify({
                    index: item.isoCode,
                    value: item.name
                  })}
                  className="block pb-2">
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          {message && <p className="text-[#ef4444]">{message}</p>}
        </div>
      )}
    />
  );
}

export default InputSelect;
