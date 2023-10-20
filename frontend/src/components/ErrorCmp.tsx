import { useState } from 'react';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';

const ErrorCmp = ({ error }: { error: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="mt-40 mb-40 flex flex-col justify-center items-center">
      <h4 className="mb-4 font-semibold text-4xl">Something went wrong</h4>
      <div className="flex items-center gap-1" onClick={() => setOpen(!open)}>
        Show more {open ? <BiUpArrow size={15} /> : <BiDownArrow size={15} />}
      </div>
      {open && <p className="mt-2 font-bold">{error}</p>}
    </div>
  );
};

export default ErrorCmp;
