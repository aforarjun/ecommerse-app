import buttonLoading from '../assets/svg/buttonLoading.svg';

const Button = ({ title, loading, icon, wrapperStyle, ...props }: any) => {
  return (
    <button
      className={`w-max group relative h-[40px] flex justify-center items-center gap-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700`}
      style={{ opacity: loading ? 0.5 : 1, ...wrapperStyle }}
      {...props}>
      <span>
        {loading && <img style={{ width: 30, height: 30 }} src={buttonLoading} alt="loding" />}
      </span>
      {title}
      {icon && icon}
    </button>
  );
};

export default Button;
