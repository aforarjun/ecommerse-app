import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { AiFillDelete, AiOutlinePlusCircle } from 'react-icons/ai';

function MultiFileSelect({ control, name, error, placeholder, label, files = [], ...props }: any) {
  const { message } = error || {};
  const [images, setImages] = useState<string[]>(files);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div>
          {label && <label className="pb-2">{label}</label>}
          <input
            type="file"
            id="upload"
            name="upload"
            multiple
            value={value?.name}
            onChange={(e: any) => {
              const filesArr: File[] = Array.from(e.target.files);

              filesArr.forEach((file) => {
                const reader = new FileReader();

                reader.onload = () => {
                  if (reader.readyState === 2) {
                    setImages((old: any) => [...old, reader.result]);
                  }
                };
                reader.readAsDataURL(file);
              });

              onChange(filesArr);
            }}
            className="hidden"
            {...props}
          />
          <ImagesContainer images={images} setImages={setImages} />
          {message && <p className="text-[#ef4444]">{message}</p>}
        </div>
      )}
    />
  );
}

const ImagesContainer = ({ images, setImages }: any) => (
  <div className="flex flex-col">
    <label htmlFor="upload">
      <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
    </label>

    <div className="w-full flex items-center flex-wrap">
      {images.map((image: any, idx: number) => (
        <div key={image + idx} className="w-[120px] h-[120px] relative">
          <span className="absolute top-0 right-0">
            <AiFillDelete
              size={20}
              onClick={() => setImages((prev: string[]) => prev.filter((pre) => pre !== image))}
            />
          </span>
          <img src={image} alt="" className="h-[120px] w-[120px] object-contain m-2" />
        </div>
      ))}
    </div>
  </div>
);

export default MultiFileSelect;
